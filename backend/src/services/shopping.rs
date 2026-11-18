use crate::{
    api::dto::{ShoppingItemResponse, ShoppingListResponse},
    errors::ApiError,
    infrastructure::repositories::ShoppingRepository,
};

pub struct ShoppingService<'a> {
    repository: ShoppingRepository<'a>,
}

impl<'a> ShoppingService<'a> {
    pub fn new(db: &'a sqlx::PgPool) -> Self {
        Self {
            repository: ShoppingRepository::new(db),
        }
    }

    pub async fn latest(&self, user_id: uuid::Uuid) -> Result<ShoppingListResponse, ApiError> {
        let list = self
            .repository
            .latest_for_user(user_id)
            .await?
            .ok_or_else(|| ApiError::NotFound("shopping list not found".to_owned()))?;
        let items = self
            .repository
            .list_items(list.id)
            .await?
            .into_iter()
            .map(Into::into)
            .collect();
        Ok(ShoppingListResponse {
            id: list.id,
            week_start: list.week_start,
            items,
        })
    }

    pub async fn update_item(
        &self,
        user_id: uuid::Uuid,
        item_id: uuid::Uuid,
        checked: bool,
    ) -> Result<ShoppingItemResponse, ApiError> {
        Ok(self
            .repository
            .update_item(user_id, item_id, checked)
            .await?
            .ok_or_else(|| ApiError::NotFound("shopping item not found".to_owned()))?
            .into())
    }
}

impl From<crate::infrastructure::db::rows::ShoppingItemRow> for ShoppingItemResponse {
    fn from(item: crate::infrastructure::db::rows::ShoppingItemRow) -> Self {
        Self {
            id: item.id,
            name: item.name,
            amount: item.amount,
            estimated_price_rub: item.estimated_price_rub,
            emoji: item.emoji,
            checked: item.checked,
        }
    }
}
