use axum::{
    extract::{Path, State},
    Json,
};
use uuid::Uuid;

use crate::{
    api::dto::{RecipeDetailsResponse, RecipeResponse},
    errors::ApiError,
    services::RecipeService,
    state::AppState,
};

pub async fn list_recipes(
    State(state): State<AppState>,
) -> Result<Json<Vec<RecipeResponse>>, ApiError> {
    Ok(Json(RecipeService::new(&state.db).list().await?))
}

pub async fn get_recipe(
    State(state): State<AppState>,
    Path(recipe_id): Path<Uuid>,
) -> Result<Json<RecipeDetailsResponse>, ApiError> {
    Ok(Json(RecipeService::new(&state.db).get(recipe_id).await?))
}
