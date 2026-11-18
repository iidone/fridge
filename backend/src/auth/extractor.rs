use axum::{
    extract::FromRequestParts,
    http::{request::Parts, HeaderMap},
};
use uuid::Uuid;

use crate::{errors::ApiError, state::AppState};

use super::decode_access_token;

#[derive(Debug, Clone, Copy)]
pub struct AuthUser {
    pub id: Uuid,
}

impl FromRequestParts<AppState> for AuthUser {
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let token = bearer_token(&parts.headers).ok_or(ApiError::Unauthorized)?;
        let claims = decode_access_token(token, &state.auth.access_secret)?;
        let id = Uuid::parse_str(&claims.sub).map_err(|_| ApiError::Unauthorized)?;
        Ok(Self { id })
    }
}

fn bearer_token(headers: &HeaderMap) -> Option<&str> {
    headers
        .get(axum::http::header::AUTHORIZATION)?
        .to_str()
        .ok()?
        .strip_prefix("Bearer ")
}
