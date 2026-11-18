use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MealPlanSummaryResponse {
    pub id: Uuid,
    pub week_start: NaiveDate,
    pub budget_rub: i32,
    pub spent_rub: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateMealPlanRequest {
    pub week_start: NaiveDate,
    pub budget_rub: i32,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MealPlanResponse {
    pub id: Uuid,
    pub week_start: NaiveDate,
    pub budget_rub: i32,
    pub spent_rub: i32,
    pub meals: Vec<MealResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MealResponse {
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
