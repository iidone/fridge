use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecipeResponse {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub meal_type: String,
    pub emoji: String,
    pub calories: i32,
    pub protein_g: f64,
    pub fat_g: f64,
    pub carbs_g: f64,
    pub cooking_minutes: i32,
    pub servings: i32,
    pub estimated_price_rub: i32,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecipeIngredientResponse {
    pub id: Uuid,
    pub recipe_id: Uuid,
    pub product_id: Option<Uuid>,
    pub name: String,
    pub amount: String,
    pub amount_value: Option<f64>,
    pub unit: Option<String>,
    pub estimated_price_rub: i32,
    pub sort_order: i16,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecipeDetailsResponse {
    #[serde(flatten)]
    pub recipe: RecipeResponse,
    pub ingredients: Vec<RecipeIngredientResponse>,
}
