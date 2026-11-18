use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::ApiError,
    infrastructure::db::rows::{RefreshTokenRow, UserAuthRow, UserRow},
};

pub struct AuthRepository<'a> {
    db: &'a PgPool,
}

impl<'a> AuthRepository<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn email_exists(&self, email: &str) -> Result<bool, ApiError> {
        Ok(sqlx::query_scalar::<_, bool>(
            "SELECT EXISTS (SELECT 1 FROM users WHERE lower(email) = $1)",
        )
        .bind(email)
        .fetch_one(self.db)
        .await?)
    }

    pub async fn create_user(
        &self,
        display_name: &str,
        email: &str,
        password_hash: &str,
    ) -> Result<UserRow, ApiError> {
        let mut tx = self.db.begin().await?;
        let user = sqlx::query_as::<_, UserRow>(
            "INSERT INTO users (display_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, display_name, email, created_at",
        )
        .bind(display_name)
        .bind(email)
        .bind(password_hash)
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query("INSERT INTO user_profiles (user_id, weekly_budget_rub) VALUES ($1, $2)")
            .bind(user.id)
            .bind(4200_i32)
            .execute(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(user)
    }

    pub async fn find_user_by_email(&self, email: &str) -> Result<Option<UserAuthRow>, ApiError> {
        Ok(sqlx::query_as::<_, UserAuthRow>(
            "SELECT id, display_name, email, password_hash, created_at FROM users WHERE lower(email) = $1",
        )
        .bind(email)
        .fetch_optional(self.db)
        .await?)
    }

    pub async fn insert_refresh_token(
        &self,
        user_id: Uuid,
        token_hash: &str,
        expires_at: chrono::DateTime<Utc>,
    ) -> Result<(), ApiError> {
        sqlx::query(
            "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
        )
        .bind(user_id)
        .bind(token_hash)
        .bind(expires_at)
        .execute(self.db)
        .await?;
        Ok(())
    }

    pub async fn rotate_refresh_token(
        &self,
        old_hash: &str,
        new_hash: &str,
        new_expires_at: chrono::DateTime<Utc>,
    ) -> Result<Option<RefreshTokenRow>, ApiError> {
        let mut tx = self.db.begin().await?;
        let stored = sqlx::query_as::<_, RefreshTokenRow>(
            "SELECT id, user_id, expires_at, revoked_at FROM refresh_tokens WHERE token_hash = $1 FOR UPDATE",
        )
        .bind(old_hash)
        .fetch_optional(&mut *tx)
        .await?;

        let Some(stored) = stored else {
            return Ok(None);
        };
        if stored.revoked_at.is_some() || stored.expires_at <= Utc::now() {
            return Ok(None);
        }

        sqlx::query("UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1")
            .bind(stored.id)
            .execute(&mut *tx)
            .await?;
        sqlx::query(
            "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
        )
        .bind(stored.user_id)
        .bind(new_hash)
        .bind(new_expires_at)
        .execute(&mut *tx)
        .await?;
        tx.commit().await?;
        Ok(Some(stored))
    }

    pub async fn revoke_refresh_token(&self, token_hash: &str) -> Result<(), ApiError> {
        sqlx::query(
            "UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL",
        )
        .bind(token_hash)
        .execute(self.db)
        .await?;
        Ok(())
    }
}
