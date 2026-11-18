use axum::{extract::State, Json};

use crate::{api::dto::HealthResponse, errors::ApiError, services::HealthService, state::AppState};

pub async fn health(State(state): State<AppState>) -> Result<Json<HealthResponse>, ApiError> {
    Ok(Json(HealthService::new(&state.db).check().await?))
}
