use axum::{extract::State, Json};

use crate::{
    api::dto::{ProfileResponse, UpdateProfileRequest},
    auth::AuthUser,
    errors::ApiError,
    services::ProfileService,
    state::AppState,
};

pub async fn get_profile(
    State(state): State<AppState>,
    user: AuthUser,
) -> Result<Json<ProfileResponse>, ApiError> {
    Ok(Json(ProfileService::new(&state.db).get(user.id).await?))
}

pub async fn update_profile(
    State(state): State<AppState>,
    user: AuthUser,
    Json(request): Json<UpdateProfileRequest>,
) -> Result<Json<ProfileResponse>, ApiError> {
    Ok(Json(
        ProfileService::new(&state.db)
            .update(user.id, request)
            .await?,
    ))
}
