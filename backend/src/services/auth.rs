use crate::{
    api::dto::{
        AuthResponse, LoginRequest, RefreshRequest, RegisterRequest, TokenResponse, UserResponse,
    },
    auth::{
        create_access_token, create_refresh_token, hash_password, hash_refresh_token,
        normalize_email, password_is_valid, refresh_expiration, validate_email, verify_password,
    },
    errors::ApiError,
    infrastructure::repositories::{AuthRepository, UserRepository},
    state::AuthConfig,
};

pub struct AuthService<'a> {
    auth_config: &'a AuthConfig,
    auth_repository: AuthRepository<'a>,
    user_repository: UserRepository<'a>,
}

impl<'a> AuthService<'a> {
    pub fn new(db: &'a sqlx::PgPool, auth_config: &'a AuthConfig) -> Self {
        Self {
            auth_config,
            auth_repository: AuthRepository::new(db),
            user_repository: UserRepository::new(db),
        }
    }

    pub async fn register(&self, request: RegisterRequest) -> Result<AuthResponse, ApiError> {
        let display_name = request.display_name.trim();
        let email = normalize_email(&request.email);
        if display_name.is_empty() {
            return Err(ApiError::BadRequest("displayName is required".to_owned()));
        }
        if !validate_email(&email) {
            return Err(ApiError::BadRequest("email is invalid".to_owned()));
        }
        if !password_is_valid(&request.password) {
            return Err(ApiError::BadRequest(
                "password must be at least 8 characters".to_owned(),
            ));
        }
        if self.auth_repository.email_exists(&email).await? {
            return Err(ApiError::Conflict("email is already registered".to_owned()));
        }

        let password_hash = hash_password(&request.password)?;
        let user = self
            .auth_repository
            .create_user(display_name, &email, &password_hash)
            .await?;
        self.issue_tokens(user.id, user.into()).await
    }

    pub async fn login(&self, request: LoginRequest) -> Result<AuthResponse, ApiError> {
        let email = normalize_email(&request.email);
        let user = self
            .auth_repository
            .find_user_by_email(&email)
            .await?
            .ok_or(ApiError::Unauthorized)?;
        let password_hash = user
            .password_hash
            .as_deref()
            .ok_or(ApiError::Unauthorized)?;
        verify_password(&request.password, password_hash)?;
        self.issue_tokens(
            user.id,
            UserResponse {
                id: user.id,
                display_name: user.display_name,
                email: user.email,
                created_at: user.created_at,
            },
        )
        .await
    }

    pub async fn refresh(&self, request: RefreshRequest) -> Result<TokenResponse, ApiError> {
        let new_refresh_token = create_refresh_token();
        let stored = self
            .auth_repository
            .rotate_refresh_token(
                &hash_refresh_token(&request.refresh_token),
                &hash_refresh_token(&new_refresh_token),
                refresh_expiration(self.auth_config)?,
            )
            .await?
            .ok_or(ApiError::Unauthorized)?;
        Ok(TokenResponse {
            access_token: create_access_token(stored.user_id, self.auth_config)?,
            refresh_token: new_refresh_token,
            expires_in: self.auth_config.access_ttl.as_secs() as i64,
        })
    }

    pub async fn logout(&self, request: RefreshRequest) -> Result<(), ApiError> {
        self.auth_repository
            .revoke_refresh_token(&hash_refresh_token(&request.refresh_token))
            .await
    }

    pub async fn me(&self, user_id: uuid::Uuid) -> Result<UserResponse, ApiError> {
        let user = self
            .user_repository
            .find_by_id(user_id)
            .await?
            .ok_or_else(|| ApiError::NotFound("user not found".to_owned()))?;
        Ok(user.into())
    }

    async fn issue_tokens(
        &self,
        user_id: uuid::Uuid,
        user: UserResponse,
    ) -> Result<AuthResponse, ApiError> {
        let access_token = create_access_token(user_id, self.auth_config)?;
        let refresh_token = create_refresh_token();
        self.auth_repository
            .insert_refresh_token(
                user_id,
                &hash_refresh_token(&refresh_token),
                refresh_expiration(self.auth_config)?,
            )
            .await?;
        Ok(AuthResponse {
            user,
            access_token,
            refresh_token,
            expires_in: self.auth_config.access_ttl.as_secs() as i64,
        })
    }
}

impl From<crate::infrastructure::db::rows::UserRow> for UserResponse {
    fn from(user: crate::infrastructure::db::rows::UserRow) -> Self {
        Self {
            id: user.id,
            display_name: user.display_name,
            email: user.email,
            created_at: user.created_at,
        }
    }
}
