use sqlx::PgPool;
use std::{env, time::Duration};

#[derive(Clone)]
pub struct AuthConfig {
    pub access_secret: String,
    pub access_ttl: Duration,
    pub refresh_ttl: Duration,
}

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub auth: AuthConfig,
}

impl AuthConfig {
    pub fn from_env() -> Result<Self, Box<dyn std::error::Error>> {
        let access_secret = env::var("JWT_ACCESS_SECRET")
            .map_err(|_| "JWT_ACCESS_SECRET must be set to a long random value")?;
        if access_secret.len() < 32 {
            return Err("JWT_ACCESS_SECRET must contain at least 32 characters".into());
        }
        Ok(Self {
            access_secret,
            access_ttl: Duration::from_secs(env::var("ACCESS_TOKEN_TTL_SECONDS")?.parse()?),
            refresh_ttl: Duration::from_secs(env::var("REFRESH_TOKEN_TTL_SECONDS")?.parse()?),
        })
    }
}
