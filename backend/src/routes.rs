use axum::{
    routing::{get, patch, post, put},
    Router,
};

use crate::{api::handlers, state::AppState};

pub fn api_routes() -> Router<AppState> {
    Router::new()
        .route("/auth/register", post(handlers::register))
        .route("/auth/login", post(handlers::login))
        .route("/auth/refresh", post(handlers::refresh))
        .route("/auth/logout", post(handlers::logout))
        .route("/auth/me", get(handlers::me))
        .route(
            "/profile",
            get(handlers::get_profile).put(handlers::update_profile),
        )
        .route(
            "/pantry",
            get(handlers::list_pantry).post(handlers::create_pantry_item),
        )
        .route(
            "/pantry/{item_id}",
            put(handlers::update_pantry_item).delete(handlers::delete_pantry_item),
        )
        .route("/recipes", get(handlers::list_recipes))
        .route("/recipes/{recipe_id}", get(handlers::get_recipe))
        .route(
            "/meal-plans",
            get(handlers::list_meal_plans).post(handlers::create_meal_plan),
        )
        .route("/meal-plans/{plan_id}", get(handlers::get_meal_plan))
        .route("/meal-plan", get(handlers::latest_meal_plan))
        .route("/shopping-list", get(handlers::latest_shopping_list))
        .route(
            "/shopping-list/items/{item_id}",
            patch(handlers::update_shopping_item),
        )
}
