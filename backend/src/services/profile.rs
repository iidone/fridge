use crate::{
    api::dto::{ProfileResponse, UpdateProfileRequest},
    errors::ApiError,
    infrastructure::repositories::ProfileRepository,
};

pub struct ProfileService<'a> {
    repository: ProfileRepository<'a>,
}

impl<'a> ProfileService<'a> {
    pub fn new(db: &'a sqlx::PgPool) -> Self {
        Self {
            repository: ProfileRepository::new(db),
        }
    }

    pub async fn get(&self, user_id: uuid::Uuid) -> Result<ProfileResponse, ApiError> {
        self.repository.ensure_exists(user_id).await?;
        let profile = self
            .repository
            .find_by_user_id(user_id)
            .await?
            .ok_or_else(|| ApiError::NotFound("profile not found".to_owned()))?;
        Ok(profile.into())
    }

    pub async fn update(
        &self,
        user_id: uuid::Uuid,
        request: UpdateProfileRequest,
    ) -> Result<ProfileResponse, ApiError> {
        if let Some(goal) = &request.nutrition_goal {
            if !matches!(goal.as_str(), "health" | "economy" | "energy") {
                return Err(ApiError::BadRequest("nutritionGoal is invalid".to_owned()));
            }
        }
        if request.weekly_budget_rub.is_some_and(|value| value < 0) {
            return Err(ApiError::BadRequest(
                "weeklyBudgetRub must be non-negative".to_owned(),
            ));
        }
        if request
            .daily_calories
            .is_some_and(|value| !(1000..=10000).contains(&value))
        {
            return Err(ApiError::BadRequest(
                "dailyCalories must be between 1000 and 10000".to_owned(),
            ));
        }
        self.repository.ensure_exists(user_id).await?;
        let profile = self
            .repository
            .update(
                user_id,
                request.nutrition_goal,
                request.weekly_budget_rub,
                request.daily_calories,
                request.allergies,
                request.disliked_foods,
            )
            .await?;
        Ok(profile.into())
    }
}

impl From<crate::infrastructure::db::rows::ProfileRow> for ProfileResponse {
    fn from(profile: crate::infrastructure::db::rows::ProfileRow) -> Self {
        Self {
            user_id: profile.user_id,
            nutrition_goal: profile.nutrition_goal,
            weekly_budget_rub: profile.weekly_budget_rub,
            daily_calories: profile.daily_calories,
            allergies: profile.allergies,
            disliked_foods: profile.disliked_foods,
            updated_at: profile.updated_at,
        }
    }
}
