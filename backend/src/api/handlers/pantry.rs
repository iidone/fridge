use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

use crate::{
    api::dto::{CreatePantryItemRequest, PantryItemResponse, UpdatePantryItemRequest},
    auth::AuthUser,
    errors::ApiError,
    services::PantryService,
    state::AppState,
};

pub async fn list_pantry(
    State(state): State<AppState>,
    user: AuthUser,
) -> Result<Json<Vec<PantryItemResponse>>, ApiError> {
    Ok(Json(PantryService::new(&state.db).list(user.id).await?))
}

pub async fn create_pantry_item(
    State(state): State<AppState>,
    user: AuthUser,
    Json(request): Json<CreatePantryItemRequest>,
) -> Result<(StatusCode, Json<PantryItemResponse>), ApiError> {
    let item = PantryService::new(&state.db)
        .create(user.id, request)
        .await?;
    Ok((StatusCode::CREATED, Json(item)))
}

pub async fn update_pantry_item(
    State(state): State<AppState>,
    user: AuthUser,
    Path(item_id): Path<Uuid>,
    Json(request): Json<UpdatePantryItemRequest>,
) -> Result<Json<PantryItemResponse>, ApiError> {
    Ok(Json(
        PantryService::new(&state.db)
            .update(user.id, item_id, request)
            .await?,
    ))
}

pub async fn delete_pantry_item(
    State(state): State<AppState>,
    user: AuthUser,
    Path(item_id): Path<Uuid>,
) -> Result<StatusCode, ApiError> {
    PantryService::new(&state.db)
        .delete(user.id, item_id)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}
