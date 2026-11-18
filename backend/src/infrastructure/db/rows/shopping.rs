use chrono::NaiveDate;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct ShoppingListRow {
    pub id: Uuid,
    pub week_start: NaiveDate,
}

#[derive(Debug, FromRow)]
pub struct ShoppingItemRow {
    pub id: Uuid,
    pub name: String,
    pub amount: String,
    pub estimated_price_rub: i32,
    pub emoji: String,
    pub checked: bool,
}
