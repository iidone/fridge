use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MealPlanResponse {
    pub week_start: &'static str,
    pub budget_rub: i32,
    pub spent_rub: i32,
    pub meals: Vec<Meal>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Meal {
    pub id: &'static str,
    pub day: &'static str,
    pub title: &'static str,
    pub description: &'static str,
    pub meal_type: &'static str,
    pub calories: i32,
    pub cooking_minutes: i32,
    pub estimated_price_rub: i32,
    pub emoji: &'static str,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingListResponse {
    pub week_start: &'static str,
    pub items: Vec<ShoppingItem>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingItem {
    pub id: &'static str,
    pub name: &'static str,
    pub amount: &'static str,
    pub price_rub: i32,
    pub emoji: &'static str,
    pub checked: bool,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
}
