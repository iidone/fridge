use axum::{
    extract::{Path, State},
    Json,
};
use uuid::Uuid;

use crate::{
    api::dto::{ShoppingItemResponse, ShoppingListResponse, UpdateShoppingItemRequest},
    auth::AuthUser,
    errors::ApiError,
    services::ShoppingService,
    state::AppState,
};

pub async fn latest_shopping_list(
    State(state): State<AppState>,
    user: AuthUser,
) -> Result<Json<ShoppingListResponse>, ApiError> {
    Ok(Json(ShoppingService::new(&state.db).latest(user.id).await?))
}

pub async fn update_shopping_item(
    State(state): State<AppState>,
    user: AuthUser,
    Path(item_id): Path<Uuid>,
    Json(request): Json<UpdateShoppingItemRequest>,
) -> Result<Json<ShoppingItemResponse>, ApiError> {
    Ok(Json(
        ShoppingService::new(&state.db)
            .update_item(user.id, item_id, request.checked)
            .await?,
    ))
}
