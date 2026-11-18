use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::ApiError,
    infrastructure::db::rows::{RecipeIngredientRow, RecipeRow},
};

pub struct RecipeRepository<'a> {
    db: &'a PgPool,
}

impl<'a> RecipeRepository<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn list(&self) -> Result<Vec<RecipeRow>, ApiError> {
        Ok(sqlx::query_as::<_, RecipeRow>(
            "SELECT id, title, description, meal_type, emoji, calories, protein_g, fat_g, carbs_g, cooking_minutes, servings, estimated_price_rub FROM recipes ORDER BY title",
        )
        .fetch_all(self.db)
        .await?)
    }

    pub async fn find_by_id(&self, recipe_id: Uuid) -> Result<Option<RecipeRow>, ApiError> {
        Ok(sqlx::query_as::<_, RecipeRow>(
            "SELECT id, title, description, meal_type, emoji, calories, protein_g, fat_g, carbs_g, cooking_minutes, servings, estimated_price_rub FROM recipes WHERE id = $1",
        )
        .bind(recipe_id)
        .fetch_optional(self.db)
        .await?)
    }

    pub async fn list_ingredients(
        &self,
        recipe_id: Uuid,
    ) -> Result<Vec<RecipeIngredientRow>, ApiError> {
        Ok(sqlx::query_as::<_, RecipeIngredientRow>(
            "SELECT id, recipe_id, product_id, name, amount, amount_value, unit, estimated_price_rub, sort_order FROM recipe_ingredients WHERE recipe_id = $1 ORDER BY sort_order, name",
        )
        .bind(recipe_id)
        .fetch_all(self.db)
        .await?)
    }
}
