use axum::{extract::State, http::StatusCode, Json};
use serde_json::json;
use sqlx::PgPool;

use crate::models::{
    HealthResponse, Meal, MealPlanResponse, ShoppingItem, ShoppingListResponse,
};

pub async fn health(
    State(pool): State<PgPool>,
) -> Result<Json<HealthResponse>, (StatusCode, Json<serde_json::Value>)> {
    sqlx::query("SELECT 1")
        .execute(&pool)
        .await
        .map_err(|error| {
            tracing::error!(%error, "database health check failed");
            (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(json!({ "error": "database unavailable" })),
            )
        })?;

    Ok(Json(HealthResponse { status: "ok" }))
}

pub async fn meal_plan() -> Json<MealPlanResponse> {
    let meals = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
        .into_iter()
        .map(|day| Meal {
            id: match day {
                "Пн" => "monday-lunch",
                "Вт" => "tuesday-lunch",
                "Ср" => "wednesday-lunch",
                "Чт" => "thursday-lunch",
                "Пт" => "friday-lunch",
                "Сб" => "saturday-lunch",
                _ => "sunday-lunch",
            },
            day,
            title: "Курица с гречкой",
            description: "и овощным салатом",
            meal_type: "Обед",
            calories: 430,
            cooking_minutes: 25,
            estimated_price_rub: 340,
            emoji: "🥗",
        })
        .collect();

    Json(MealPlanResponse {
        week_start: "2026-11-16",
        budget_rub: 4200,
        spent_rub: 2610,
        meals,
    })
}

pub async fn shopping_list() -> Json<ShoppingListResponse> {
    Json(ShoppingListResponse {
        week_start: "2026-11-16",
        items: vec![
            ShoppingItem { id: "chicken", name: "Куриная грудка", amount: "500 г", price_rub: 280, emoji: "🍗", checked: false },
            ShoppingItem { id: "tomato", name: "Томаты черри", amount: "250 г", price_rub: 160, emoji: "🍅", checked: false },
            ShoppingItem { id: "cucumber", name: "Огурцы", amount: "2 шт.", price_rub: 90, emoji: "🥒", checked: false },
            ShoppingItem { id: "avocado", name: "Авокадо", amount: "1 шт.", price_rub: 140, emoji: "🥑", checked: false },
            ShoppingItem { id: "greens", name: "Свежая зелень", amount: "1 пучок", price_rub: 65, emoji: "🥬", checked: false },
            ShoppingItem { id: "yogurt", name: "Греческий йогурт", amount: "150 г", price_rub: 85, emoji: "🥛", checked: true },
        ],
    })
}
