use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

use crate::{
    api::dto::{CreateMealPlanRequest, MealPlanResponse, MealPlanSummaryResponse},
    auth::AuthUser,
    errors::ApiError,
    services::MealPlanService,
    state::AppState,
};

pub async fn list_meal_plans(
    State(state): State<AppState>,
    user: AuthUser,
) -> Result<Json<Vec<MealPlanSummaryResponse>>, ApiError> {
    Ok(Json(MealPlanService::new(&state.db).list(user.id).await?))
}

pub async fn create_meal_plan(
    State(state): State<AppState>,
    user: AuthUser,
    Json(request): Json<CreateMealPlanRequest>,
) -> Result<(StatusCode, Json<MealPlanSummaryResponse>), ApiError> {
    let plan = MealPlanService::new(&state.db)
        .create(user.id, request)
        .await?;
    Ok((StatusCode::CREATED, Json(plan)))
}

pub async fn latest_meal_plan(
    State(state): State<AppState>,
    user: AuthUser,
) -> Result<Json<MealPlanResponse>, ApiError> {
    Ok(Json(MealPlanService::new(&state.db).latest(user.id).await?))
}

pub async fn get_meal_plan(
    State(state): State<AppState>,
    user: AuthUser,
    Path(plan_id): Path<Uuid>,
) -> Result<Json<MealPlanResponse>, ApiError> {
    Ok(Json(
        MealPlanService::new(&state.db)
            .get(user.id, plan_id)
            .await?,
    ))
}
