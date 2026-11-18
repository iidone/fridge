use sqlx::PgPool;
use uuid::Uuid;

use crate::{errors::ApiError, infrastructure::db::rows::ProfileRow};

pub struct ProfileRepository<'a> {
    db: &'a PgPool,
}

impl<'a> ProfileRepository<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn ensure_exists(&self, user_id: Uuid) -> Result<(), ApiError> {
        sqlx::query(
            "INSERT INTO user_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
        )
        .bind(user_id)
        .execute(self.db)
        .await?;
        Ok(())
    }

    pub async fn find_by_user_id(&self, user_id: Uuid) -> Result<Option<ProfileRow>, ApiError> {
        Ok(sqlx::query_as::<_, ProfileRow>(
            "SELECT user_id, nutrition_goal, weekly_budget_rub, daily_calories, allergies, disliked_foods, updated_at FROM user_profiles WHERE user_id = $1",
        )
        .bind(user_id)
        .fetch_optional(self.db)
        .await?)
    }

    pub async fn update(
        &self,
        user_id: Uuid,
        nutrition_goal: Option<String>,
        weekly_budget_rub: Option<i32>,
        daily_calories: Option<i32>,
        allergies: Option<Vec<String>>,
        disliked_foods: Option<Vec<String>>,
    ) -> Result<ProfileRow, ApiError> {
        Ok(sqlx::query_as::<_, ProfileRow>(
            "UPDATE user_profiles SET nutrition_goal = COALESCE($2, nutrition_goal), weekly_budget_rub = COALESCE($3, weekly_budget_rub), daily_calories = COALESCE($4, daily_calories), allergies = COALESCE($5, allergies), disliked_foods = COALESCE($6, disliked_foods), updated_at = now() WHERE user_id = $1 RETURNING user_id, nutrition_goal, weekly_budget_rub, daily_calories, allergies, disliked_foods, updated_at",
        )
        .bind(user_id)
        .bind(nutrition_goal)
        .bind(weekly_budget_rub)
        .bind(daily_calories)
        .bind(allergies)
        .bind(disliked_foods)
        .fetch_one(self.db)
        .await?)
    }
}
