use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProfileResponse {
    pub user_id: Uuid,
    pub nutrition_goal: String,
    pub weekly_budget_rub: i32,
    pub daily_calories: i32,
    pub allergies: Vec<String>,
    pub disliked_foods: Vec<String>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProfileRequest {
    pub nutrition_goal: Option<String>,
    pub weekly_budget_rub: Option<i32>,
    pub daily_calories: Option<i32>,
    pub allergies: Option<Vec<String>>,
    pub disliked_foods: Option<Vec<String>>,
}
