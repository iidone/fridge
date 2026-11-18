use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct ProfileRow {
    pub user_id: Uuid,
    pub nutrition_goal: String,
    pub weekly_budget_rub: i32,
    pub daily_calories: i32,
    pub allergies: Vec<String>,
    pub disliked_foods: Vec<String>,
    pub updated_at: DateTime<Utc>,
}
