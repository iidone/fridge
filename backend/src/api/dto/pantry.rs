use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PantryItemResponse {
    pub id: Uuid,
    pub name: String,
    pub amount: f64,
    pub unit: String,
    pub expires_at: Option<NaiveDate>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatePantryItemRequest {
    pub name: String,
    pub amount: f64,
    pub unit: String,
    pub expires_at: Option<NaiveDate>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePantryItemRequest {
    pub name: Option<String>,
    pub amount: Option<f64>,
    pub unit: Option<String>,
    pub expires_at: Option<NaiveDate>,
}
