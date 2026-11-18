use crate::{
    api::dto::{RecipeDetailsResponse, RecipeIngredientResponse, RecipeResponse},
    errors::ApiError,
    infrastructure::repositories::RecipeRepository,
};

pub struct RecipeService<'a> {
    repository: RecipeRepository<'a>,
}

impl<'a> RecipeService<'a> {
    pub fn new(db: &'a sqlx::PgPool) -> Self {
        Self {
            repository: RecipeRepository::new(db),
        }
    }

    pub async fn list(&self) -> Result<Vec<RecipeResponse>, ApiError> {
        Ok(self
            .repository
            .list()
            .await?
            .into_iter()
            .map(Into::into)
            .collect())
    }

    pub async fn get(&self, recipe_id: uuid::Uuid) -> Result<RecipeDetailsResponse, ApiError> {
        let recipe = self
            .repository
            .find_by_id(recipe_id)
            .await?
            .ok_or_else(|| ApiError::NotFound("recipe not found".to_owned()))?;
        let ingredients = self
            .repository
            .list_ingredients(recipe_id)
            .await?
            .into_iter()
            .map(Into::into)
            .collect();
        Ok(RecipeDetailsResponse {
            recipe: recipe.into(),
            ingredients,
        })
    }
}

impl From<crate::infrastructure::db::rows::RecipeRow> for RecipeResponse {
    fn from(recipe: crate::infrastructure::db::rows::RecipeRow) -> Self {
        Self {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            meal_type: recipe.meal_type,
            emoji: recipe.emoji,
            calories: recipe.calories,
            protein_g: recipe.protein_g,
            fat_g: recipe.fat_g,
            carbs_g: recipe.carbs_g,
            cooking_minutes: recipe.cooking_minutes,
            servings: recipe.servings,
            estimated_price_rub: recipe.estimated_price_rub,
        }
    }
}

impl From<crate::infrastructure::db::rows::RecipeIngredientRow> for RecipeIngredientResponse {
    fn from(ingredient: crate::infrastructure::db::rows::RecipeIngredientRow) -> Self {
        Self {
            id: ingredient.id,
            recipe_id: ingredient.recipe_id,
            product_id: ingredient.product_id,
            name: ingredient.name,
            amount: ingredient.amount,
            amount_value: ingredient.amount_value,
            unit: ingredient.unit,
            estimated_price_rub: ingredient.estimated_price_rub,
            sort_order: ingredient.sort_order,
        }
    }
}
