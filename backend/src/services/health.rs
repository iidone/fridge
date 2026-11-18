use crate::{
    api::dto::HealthResponse, errors::ApiError, infrastructure::repositories::HealthRepository,
};

pub struct HealthService<'a> {
    repository: HealthRepository<'a>,
}

impl<'a> HealthService<'a> {
    pub fn new(db: &'a sqlx::PgPool) -> Self {
        Self {
            repository: HealthRepository::new(db),
        }
    }

    pub async fn check(&self) -> Result<HealthResponse, ApiError> {
        self.repository.check().await?;
        Ok(HealthResponse { status: "ok" })
    }
}
