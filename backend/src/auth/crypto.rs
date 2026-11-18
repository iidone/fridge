use std::time::{SystemTime, UNIX_EPOCH};

use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use chrono::Utc;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use password_hash::{rand_core::OsRng, SaltString};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::{errors::ApiError, state::AuthConfig};

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct AccessClaims {
    pub sub: String,
    pub exp: usize,
    pub token_type: String,
}

pub fn hash_password(password: &str) -> Result<String, ApiError> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(ApiError::internal)
}

pub fn verify_password(password: &str, hash: &str) -> Result<(), ApiError> {
    let parsed = PasswordHash::new(hash).map_err(|_| ApiError::Unauthorized)?;
    Argon2::default()
        .verify_password(password.as_bytes(), &parsed)
        .map_err(|_| ApiError::Unauthorized)
}

pub fn create_access_token(user_id: Uuid, config: &AuthConfig) -> Result<String, ApiError> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(ApiError::internal)?
        .as_secs();
    let claims = AccessClaims {
        sub: user_id.to_string(),
        exp: (now + config.access_ttl.as_secs()) as usize,
        token_type: "access".to_owned(),
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.access_secret.as_bytes()),
    )
    .map_err(ApiError::internal)
}

pub fn decode_access_token(token: &str, secret: &str) -> Result<AccessClaims, ApiError> {
    let mut validation = Validation::default();
    validation.validate_exp = true;
    let data = decode::<AccessClaims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation,
    )
    .map_err(|_| ApiError::Unauthorized)?;
    if data.claims.token_type != "access" {
        return Err(ApiError::Unauthorized);
    }
    Ok(data.claims)
}

pub fn create_refresh_token() -> String {
    let mut bytes = [0_u8; 48];
    bytes[..16].copy_from_slice(Uuid::new_v4().as_bytes());
    bytes[16..32].copy_from_slice(Uuid::new_v4().as_bytes());
    bytes[32..48].copy_from_slice(Uuid::new_v4().as_bytes());
    URL_SAFE_NO_PAD.encode(bytes)
}

pub fn hash_refresh_token(token: &str) -> String {
    hex::encode(Sha256::digest(token.as_bytes()))
}

pub fn refresh_expiration(config: &AuthConfig) -> Result<chrono::DateTime<Utc>, ApiError> {
    Ok(Utc::now() + chrono::Duration::from_std(config.refresh_ttl).map_err(ApiError::internal)?)
}

pub fn normalize_email(email: &str) -> String {
    email.trim().to_lowercase()
}

pub fn validate_email(email: &str) -> bool {
    let parts: Vec<_> = email.split('@').collect();
    parts.len() == 2 && !parts[0].is_empty() && parts[1].contains('.')
}

pub fn password_is_valid(password: &str) -> bool {
    password.len() >= 8
}
