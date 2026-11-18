mod api;
mod auth;
mod errors;
mod infrastructure;
mod routes;
mod services;
mod state;

use std::{env, error::Error, net::SocketAddr, path::Path};

use axum::{routing::get, Router};
use sqlx::postgres::PgPoolOptions;
use tower_http::cors::CorsLayer;

use crate::{
    api::handlers,
    state::{AppState, AuthConfig},
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    if Path::new(".env").exists() {
        dotenvy::from_path(".env")?;
    }

    let log_filter = env::var("RUST_LOG").unwrap_or_else(|_| "info".to_owned());
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::try_new(log_filter)?)
        .init();

    let database_url = env::var("DATABASE_URL")?;
    let bind_address: SocketAddr = env::var("BIND_ADDRESS")
        .unwrap_or_else(|_| "0.0.0.0:3000".to_owned())
        .parse()?;

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let app_state = AppState {
        db: pool,
        auth: AuthConfig::from_env()?,
    };
    let app = Router::new()
        .route("/health", get(handlers::health))
        .nest("/api/v1", routes::api_routes())
        .with_state(app_state)
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind(bind_address).await?;
    tracing::info!(%bind_address, "food planner API listening");
    axum::serve(listener, app).await?;

    Ok(())
}
