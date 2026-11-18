use chrono::{DateTime, NaiveDate, Utc};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct MealPlanRow {
    pub id: Uuid,
    pub week_start: NaiveDate,
    pub budget_rub: i32,
    pub spent_rub: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, FromRow)]
pub struct MealRow {
    pub id: Uuid,
    pub day: String,
    pub title: String,
    pub description: String,
    pub meal_type: String,
    pub calories: i32,
    pub cooking_minutes: i32,
    pub estimated_price_rub: i32,
    pub emoji: String,
}
