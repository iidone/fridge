use axum::{routing::get, Router};
use sqlx::PgPool;

use crate::handlers;

pub fn api_routes() -> Router<PgPool> {
    Router::new()
        .route("/meal-plan", get(handlers::meal_plan))
        .route("/shopping-list", get(handlers::shopping_list))
}
