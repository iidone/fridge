use crate::{
    api::dto::{CreateMealPlanRequest, MealPlanResponse, MealPlanSummaryResponse, MealResponse},
    errors::ApiError,
    infrastructure::repositories::MealPlanRepository,
};

pub struct MealPlanService<'a> {
    repository: MealPlanRepository<'a>,
}

impl<'a> MealPlanService<'a> {
    pub fn new(db: &'a sqlx::PgPool) -> Self {
        Self {
            repository: MealPlanRepository::new(db),
        }
    }

    pub async fn list(
        &self,
        user_id: uuid::Uuid,
    ) -> Result<Vec<MealPlanSummaryResponse>, ApiError> {
        Ok(self
            .repository
            .list_for_user(user_id)
            .await?
            .into_iter()
            .map(Into::into)
            .collect())
    }

    pub async fn create(
        &self,
        user_id: uuid::Uuid,
        request: CreateMealPlanRequest,
    ) -> Result<MealPlanSummaryResponse, ApiError> {
        if request.budget_rub < 0 {
            return Err(ApiError::BadRequest(
                "budgetRub must be non-negative".to_owned(),
            ));
        }
        Ok(self
            .repository
            .create_or_update(user_id, request.week_start, request.budget_rub)
            .await?
            .into())
    }

    pub async fn latest(&self, user_id: uuid::Uuid) -> Result<MealPlanResponse, ApiError> {
        let plan_id = self
            .repository
            .latest_id(user_id)
            .await?
            .ok_or_else(|| ApiError::NotFound("meal plan not found".to_owned()))?;
        self.get(user_id, plan_id).await
    }

    pub async fn get(
        &self,
        user_id: uuid::Uuid,
        plan_id: uuid::Uuid,
    ) -> Result<MealPlanResponse, ApiError> {
        let plan = self
            .repository
            .find_for_user(user_id, plan_id)
            .await?
            .ok_or_else(|| ApiError::NotFound("meal plan not found".to_owned()))?;
        let meals = self
            .repository
            .list_meals(plan_id)
            .await?
            .into_iter()
            .map(Into::into)
            .collect();
        Ok(MealPlanResponse {
            id: plan.id,
            week_start: plan.week_start,
            budget_rub: plan.budget_rub,
            spent_rub: plan.spent_rub,
            meals,
        })
    }
}

impl From<crate::infrastructure::db::rows::MealPlanRow> for MealPlanSummaryResponse {
    fn from(plan: crate::infrastructure::db::rows::MealPlanRow) -> Self {
        Self {
            id: plan.id,
            week_start: plan.week_start,
            budget_rub: plan.budget_rub,
            spent_rub: plan.spent_rub,
            created_at: plan.created_at,
        }
    }
}

impl From<crate::infrastructure::db::rows::MealRow> for MealResponse {
    fn from(meal: crate::infrastructure::db::rows::MealRow) -> Self {
        Self {
            id: meal.id,
            day: meal.day,
            title: meal.title,
            description: meal.description,
            meal_type: meal.meal_type,
            calories: meal.calories,
            cooking_minutes: meal.cooking_minutes,
            estimated_price_rub: meal.estimated_price_rub,
            emoji: meal.emoji,
        }
    }
}
