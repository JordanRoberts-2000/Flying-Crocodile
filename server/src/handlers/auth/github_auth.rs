use std::sync::Arc;

use actix_web::{http::header, web, Error, HttpRequest, HttpResponse};
use log::{error, info};
use rand::Rng;
use url::Url;

use crate::{
    config::logging::Log, services::auth::AuthService, state::app_state::AppState,
    utils::env::get_env_var,
};

/// Handler to redirect users to GitHub for OAuth
pub async fn github_auth(
    req: HttpRequest,
    app_state: web::Data<Arc<AppState>>,
) -> Result<HttpResponse, Error> {
    info!("GitHub auth hit");

    if let Ok(Some(_)) = AuthService::is_authenticated(&req, &app_state) {
        Log::info(&req, "User already authenticated; redirecting to homepage.");
        return Ok(HttpResponse::Found()
            .append_header((header::LOCATION, "/"))
            .finish());
    }

    let client_id = get_env_var("GITHUB_CLIENT_ID")?;
    let redirect_uri = get_env_var("GITHUB_REDIRECT_URI")?;

    let unique_state: String = rand::thread_rng()
        .sample_iter(&rand::distributions::Alphanumeric)
        .take(32) // 32-character random string
        .map(char::from)
        .collect();

    let auth_url = Url::parse_with_params(
        "https://github.com/login/oauth/authorize",
        &[
            ("client_id", &client_id),
            ("redirect_uri", &redirect_uri),
            ("scope", &"user:email read:user".to_string()), // Scope: requesting access to user's name, email & profile_pic
            ("state", &unique_state), // CSRF protection (generate dynamically in production)
        ],
    )
    .map_err(|e| {
        error!("GitHub auth - Failed to parse GitHub OAuth URL: {}", e);
        actix_web::error::ErrorInternalServerError("Internal server error")
    })?;

    info!("GitHub auth Successful - Redirecting user to Github login");

    Ok(HttpResponse::Found()
        .append_header(("Location", auth_url.to_string()))
        .finish())
}
