use crate::{
    api::dto::{CreatePantryItemRequest, PantryItemResponse, UpdatePantryItemRequest},
    errors::ApiError,
    infrastructure::repositories::PantryRepository,
};

pub struct PantryService<'a> {
    repository: PantryRepository<'a>,
}

impl<'a> PantryService<'a> {
    pub fn new(db: &'a sqlx::PgPool) -> Self {
        Self {
            repository: PantryRepository::new(db),
        }
    }

    pub async fn list(&self, user_id: uuid::Uuid) -> Result<Vec<PantryItemResponse>, ApiError> {
        Ok(self
            .repository
            .list_for_user(user_id)
            .await?
            .into_iter()
            .map(Into::into)
            .collect())
    }

    pub async fn create(
        &self,
        user_id: uuid::Uuid,
        request: CreatePantryItemRequest,
    ) -> Result<PantryItemResponse, ApiError> {
        let name = request.name.trim();
        let unit = request.unit.trim();
        if name.is_empty() || unit.is_empty() || request.amount <= 0.0 {
            return Err(ApiError::BadRequest(
                "name, unit and positive amount are required".to_owned(),
            ));
        }
        Ok(self
            .repository
            .create_or_add(user_id, name, request.amount, unit, request.expires_at)
            .await?
            .into())
    }

    pub async fn update(
        &self,
        user_id: uuid::Uuid,
        item_id: uuid::Uuid,
        request: UpdatePantryItemRequest,
    ) -> Result<PantryItemResponse, ApiError> {
        if request.amount.is_some_and(|value| value <= 0.0) {
            return Err(ApiError::BadRequest("amount must be positive".to_owned()));
        }
        if request
            .name
            .as_ref()
            .is_some_and(|value| value.trim().is_empty())
            || request
                .unit
                .as_ref()
                .is_some_and(|value| value.trim().is_empty())
        {
            return Err(ApiError::BadRequest(
                "name and unit must not be empty".to_owned(),
            ));
        }
        let item = self
            .repository
            .update(
                user_id,
                item_id,
                request.name.map(|value| value.trim().to_owned()),
                request.amount,
                request.unit.map(|value| value.trim().to_owned()),
                request.expires_at,
            )
            .await?
            .ok_or_else(|| ApiError::NotFound("pantry item not found".to_owned()))?;
        Ok(item.into())
    }

    pub async fn delete(&self, user_id: uuid::Uuid, item_id: uuid::Uuid) -> Result<(), ApiError> {
        if !self.repository.delete(user_id, item_id).await? {
            return Err(ApiError::NotFound("pantry item not found".to_owned()));
        }
        Ok(())
    }
}

impl From<crate::infrastructure::db::rows::PantryItemRow> for PantryItemResponse {
    fn from(item: crate::infrastructure::db::rows::PantryItemRow) -> Self {
        Self {
            id: item.id,
            name: item.name,
            amount: item.amount,
            unit: item.unit,
            expires_at: item.expires_at,
            created_at: item.created_at,
            updated_at: item.updated_at,
        }
    }
}
