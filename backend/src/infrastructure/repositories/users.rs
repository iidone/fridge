use sqlx::PgPool;
use uuid::Uuid;

use crate::{errors::ApiError, infrastructure::db::rows::UserRow};

pub struct UserRepository<'a> {
    db: &'a PgPool,
}

impl<'a> UserRepository<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn find_by_id(&self, user_id: Uuid) -> Result<Option<UserRow>, ApiError> {
        Ok(sqlx::query_as::<_, UserRow>(
            "SELECT id, display_name, email, created_at FROM users WHERE id = $1",
        )
        .bind(user_id)
        .fetch_optional(self.db)
        .await?)
    }
}
