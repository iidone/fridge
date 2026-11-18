use sqlx::PgPool;

use crate::errors::ApiError;

pub struct HealthRepository<'a> {
    db: &'a PgPool,
}

impl<'a> HealthRepository<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn check(&self) -> Result<(), ApiError> {
        sqlx::query("SELECT 1").execute(self.db).await?;
        Ok(())
    }
}
