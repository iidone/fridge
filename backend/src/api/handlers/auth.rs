use axum::{extract::State, http::StatusCode, Json};

use crate::{
    api::dto::{
        AuthResponse, LoginRequest, RefreshRequest, RegisterRequest, TokenResponse, UserResponse,
    },
    auth::AuthUser,
    errors::ApiError,
    services::AuthService,
    state::AppState,
};

pub async fn register(
    State(state): State<AppState>,
    Json(request): Json<RegisterRequest>,
) -> Result<(StatusCode, Json<AuthResponse>), ApiError> {
    let response = AuthService::new(&state.db, &state.auth)
        .register(request)
        .await?;
    Ok((StatusCode::CREATED, Json(response)))
}

pub async fn login(
    State(state): State<AppState>,
    Json(request): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, ApiError> {
    Ok(Json(
        AuthService::new(&state.db, &state.auth)
            .login(request)
            .await?,
    ))
}

pub async fn refresh(
    State(state): State<AppState>,
    Json(request): Json<RefreshRequest>,
) -> Result<Json<TokenResponse>, ApiError> {
    Ok(Json(
        AuthService::new(&state.db, &state.auth)
            .refresh(request)
            .await?,
    ))
}

pub async fn logout(
    State(state): State<AppState>,
    Json(request): Json<RefreshRequest>,
) -> Result<StatusCode, ApiError> {
    AuthService::new(&state.db, &state.auth)
        .logout(request)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn me(
    State(state): State<AppState>,
    user: AuthUser,
) -> Result<Json<UserResponse>, ApiError> {
    Ok(Json(
        AuthService::new(&state.db, &state.auth).me(user.id).await?,
    ))
}
