use chrono::NaiveDate;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::ApiError,
    infrastructure::db::rows::{MealPlanRow, MealRow},
};

pub struct MealPlanRepository<'a> {
    db: &'a PgPool,
}

impl<'a> MealPlanRepository<'a> {
    pub fn new(db: &'a PgPool) -> Self {
        Self { db }
    }

    pub async fn list_for_user(&self, user_id: Uuid) -> Result<Vec<MealPlanRow>, ApiError> {
        Ok(sqlx::query_as::<_, MealPlanRow>(
            "SELECT id, week_start, budget_rub, spent_rub, created_at FROM meal_plans WHERE user_id = $1 ORDER BY week_start DESC",
        )
        .bind(user_id)
        .fetch_all(self.db)
        .await?)
    }

    pub async fn create_or_update(
        &self,
        user_id: Uuid,
        week_start: NaiveDate,
        budget_rub: i32,
    ) -> Result<MealPlanRow, ApiError> {
        let mut tx = self.db.begin().await?;
        let plan = sqlx::query_as::<_, MealPlanRow>(
            "INSERT INTO meal_plans (user_id, week_start, budget_rub) VALUES ($1, $2, $3) ON CONFLICT (user_id, week_start) DO UPDATE SET budget_rub = EXCLUDED.budget_rub RETURNING id, week_start, budget_rub, spent_rub, created_at",
        )
        .bind(user_id)
        .bind(week_start)
        .bind(budget_rub)
        .fetch_one(&mut *tx)
        .await?;
        sqlx::query(
            "INSERT INTO shopping_lists (user_id, week_start) VALUES ($1, $2) ON CONFLICT (user_id, week_start) DO NOTHING",
        )
        .bind(user_id)
        .bind(week_start)
        .execute(&mut *tx)
        .await?;
        tx.commit().await?;
        Ok(plan)
    }

    pub async fn find_for_user(
        &self,
        user_id: Uuid,
        plan_id: Uuid,
    ) -> Result<Option<MealPlanRow>, ApiError> {
        Ok(sqlx::query_as::<_, MealPlanRow>(
            "SELECT id, week_start, budget_rub, spent_rub, created_at FROM meal_plans WHERE id = $1 AND user_id = $2",
        )
        .bind(plan_id)
        .bind(user_id)
        .fetch_optional(self.db)
        .await?)
    }

    pub async fn latest_id(&self, user_id: Uuid) -> Result<Option<Uuid>, ApiError> {
        Ok(sqlx::query_scalar::<_, Uuid>(
            "SELECT id FROM meal_plans WHERE user_id = $1 ORDER BY week_start DESC LIMIT 1",
        )
        .bind(user_id)
        .fetch_optional(self.db)
        .await?)
    }

    pub async fn list_meals(&self, plan_id: Uuid) -> Result<Vec<MealRow>, ApiError> {
        Ok(sqlx::query_as::<_, MealRow>(
            "SELECT mpi.id, to_char(mpi.meal_date, 'YYYY-MM-DD') AS day, r.title, r.description, mpi.meal_type, r.calories, r.cooking_minutes, r.estimated_price_rub, r.emoji FROM meal_plan_items mpi JOIN recipes r ON r.id = mpi.recipe_id WHERE mpi.meal_plan_id = $1 ORDER BY mpi.meal_date, mpi.meal_type",
        )
        .bind(plan_id)
        .fetch_all(self.db)
        .await?)
    }
}
