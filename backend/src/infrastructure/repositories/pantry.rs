use chrono::NaiveDate;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{errors::ApiError, infrastructure::db::rows::PantryItemRow};

pub struct PantryRepository<'a> {
    db: &'a PgPool,
}

impl<'a> PantryRepository<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn list_for_user(&self, user_id: Uuid) -> Result<Vec<PantryItemRow>, ApiError> {
        Ok(sqlx::query_as::<_, PantryItemRow>(
            "SELECT id, name, amount, unit, expires_at, created_at, updated_at FROM pantry_items WHERE user_id = $1 ORDER BY expires_at NULLS LAST, name",
        )
        .bind(user_id)
        .fetch_all(self.db)
        .await?)
    }

    pub async fn create_or_add(
        &self,
        user_id: Uuid,
        name: &str,
        amount: f64,
        unit: &str,
        expires_at: Option<NaiveDate>,
    ) -> Result<PantryItemRow, ApiError> {
        Ok(sqlx::query_as::<_, PantryItemRow>(
            "INSERT INTO pantry_items (user_id, name, amount, unit, expires_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, name, unit) DO UPDATE SET amount = pantry_items.amount + EXCLUDED.amount, expires_at = EXCLUDED.expires_at, updated_at = now() RETURNING id, name, amount, unit, expires_at, created_at, updated_at",
        )
        .bind(user_id)
        .bind(name)
        .bind(amount)
        .bind(unit)
        .bind(expires_at)
        .fetch_one(self.db)
        .await?)
    }

    pub async fn update(
        &self,
        user_id: Uuid,
        item_id: Uuid,
        name: Option<String>,
        amount: Option<f64>,
        unit: Option<String>,
        expires_at: Option<NaiveDate>,
    ) -> Result<Option<PantryItemRow>, ApiError> {
        Ok(sqlx::query_as::<_, PantryItemRow>(
            "UPDATE pantry_items SET name = COALESCE($3, name), amount = COALESCE($4, amount), unit = COALESCE($5, unit), expires_at = COALESCE($6, expires_at), updated_at = now() WHERE id = $1 AND user_id = $2 RETURNING id, name, amount, unit, expires_at, created_at, updated_at",
        )
        .bind(item_id)
        .bind(user_id)
        .bind(name)
        .bind(amount)
        .bind(unit)
        .bind(expires_at)
        .fetch_optional(self.db)
        .await?)
    }

    pub async fn delete(&self, user_id: Uuid, item_id: Uuid) -> Result<bool, ApiError> {
        Ok(
            sqlx::query("DELETE FROM pantry_items WHERE id = $1 AND user_id = $2")
                .bind(item_id)
                .bind(user_id)
                .execute(self.db)
                .await?
                .rows_affected()
                > 0,
        )
    }
}
