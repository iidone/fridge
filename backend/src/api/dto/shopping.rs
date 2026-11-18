use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingListResponse {
    pub id: Uuid,
    pub week_start: NaiveDate,
    pub items: Vec<ShoppingItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingItemResponse {
    pub id: Uuid,
    pub name: String,
    pub amount: String,
    pub estimated_price_rub: i32,
    pub emoji: String,
    pub checked: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateShoppingItemRequest {
    pub checked: bool,
}
