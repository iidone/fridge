use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::ApiError,
    infrastructure::db::rows::{ShoppingItemRow, ShoppingListRow},
};

pub struct ShoppingRepository<'a> {
    db: &'a PgPool,
}

impl<'a> ShoppingRepository<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn latest_for_user(
        &self,
        user_id: Uuid,
    ) -> Result<Option<ShoppingListRow>, ApiError> {
        Ok(sqlx::query_as::<_, ShoppingListRow>(
            "SELECT id, week_start FROM shopping_lists WHERE user_id = $1 ORDER BY week_start DESC LIMIT 1",
        )
        .bind(user_id)
        .fetch_optional(self.db)
        .await?)
    }

    pub async fn list_items(&self, list_id: Uuid) -> Result<Vec<ShoppingItemRow>, ApiError> {
        Ok(sqlx::query_as::<_, ShoppingItemRow>(
            "SELECT id, name, amount, estimated_price_rub, emoji, is_checked AS checked FROM shopping_list_items WHERE shopping_list_id = $1 ORDER BY name",
        )
        .bind(list_id)
        .fetch_all(self.db)
        .await?)
    }

    pub async fn update_item(
        &self,
        user_id: Uuid,
        item_id: Uuid,
        checked: bool,
    ) -> Result<Option<ShoppingItemRow>, ApiError> {
        Ok(sqlx::query_as::<_, ShoppingItemRow>(
            "UPDATE shopping_list_items item SET is_checked = $1 FROM shopping_lists list WHERE item.id = $2 AND item.shopping_list_id = list.id AND list.user_id = $3 RETURNING item.id, item.name, item.amount, item.estimated_price_rub, item.emoji, item.is_checked AS checked",
        )
        .bind(checked)
        .bind(item_id)
        .bind(user_id)
        .fetch_optional(self.db)
        .await?)
    }
}
