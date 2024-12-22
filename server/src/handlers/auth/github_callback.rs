use std::sync::Arc;

use actix_web::{http::header, web, Error, HttpRequest, HttpResponse};
use log::{debug, error, info, warn};
use uuid::Uuid;

use crate::{
    config::logging::Log,
    models::auth::github::{GitHubAccessTokenResponse, GitHubCallbackQueryParams, GitHubUser},
    services::auth::AuthService,
    state::app_state::AppState,
    utils::env::get_env_var,
};

pub async fn github_callback(
    req: HttpRequest,
    app_state: web::Data<Arc<AppState>>,
    query: web::Query<GitHubCallbackQueryParams>,
) -> Result<HttpResponse, Error> {
    info!("GitHub callback hit");

    if let Ok(Some(_)) = AuthService::is_authenticated(&req, &app_state) {
        Log::info(&req, "User already logged in; skipping GitHub login flow.");
        return Ok(HttpResponse::Found()
            .append_header((header::LOCATION, "/"))
            .finish());
    }

    let github_client_id = get_env_var("GITHUB_CLIENT_ID")?;
    let github_client_secret = get_env_var("GITHUB_CLIENT_SECRET")?;
    let admin_username = get_env_var("GITHUB_ADMIN_USERNAME")?;
    let login_redirect = get_env_var("SUCCESSFUL_LOGIN_REDIRECT")?;

    let code = &query.code;
    let state = &query.state;

    // Validate CSRF protection state
    if state.is_none() {
        error!("GitHub callback - Missing state parameter for CSRF protection");
        return Ok(HttpResponse::BadRequest().body("Invalid request: Missing state"));
    }

    // Step 1: Exchange code for access token
    let client = reqwest::Client::new();
    let token_response = client
        .post("https://github.com/login/oauth/access_token")
        .header("Accept", "application/json")
        .form(&[
            ("client_id", github_client_id.as_str()),
            ("client_secret", github_client_secret.as_str()),
            ("code", code.as_str()),
        ])
        .send()
        .await;

    let token_response = match token_response {
        Ok(resp) => resp,
        Err(e) => {
            error!(
                "GitHub callback - Failed to exchange code for access token: {}",
                e
            );
            return Ok(HttpResponse::InternalServerError().body("Internal Server Error"));
        }
    };

    let body = match token_response.text().await {
        Ok(body) => body,
        Err(e) => {
            error!(
                "GitHub callback - Failed to read access token response body: {}",
                e
            );
            return Ok(HttpResponse::InternalServerError().body("Internal Server Error"));
        }
    };

    let access_token = match serde_json::from_str::<GitHubAccessTokenResponse>(&body) {
        Ok(token) => token.access_token,
        Err(e) => {
            error!(
                "GitHub callback - Failed to parse access token response: {}",
                e
            );
            return Ok(HttpResponse::InternalServerError().body("Internal Server Error"));
        }
    };

    // Step 2: Fetch user information from GitHub
    let user_response = client
        .get("https://api.github.com/user")
        .header("Authorization", format!("Bearer {}", access_token))
        .header("User-Agent", "Actix-Web-OAuth-App") // Required for GitHub API
        .send()
        .await;

    let user = match user_response {
        Ok(resp) => match resp.json::<GitHubUser>().await {
            Ok(user) => user,
            Err(e) => {
                error!("GitHub callback - Failed to parse user info: {}", e);
                return Ok(HttpResponse::InternalServerError().body("Internal Server Error"));
            }
        },
        Err(e) => {
            error!("GitHub callback - Failed to fetch user info: {}", e);
            return Ok(HttpResponse::InternalServerError().body("Internal Server Error"));
        }
    };

    if user.login != admin_username {
        warn!("Unauthorized GitHub login attempt by user: {}", user.login);
        return Ok(HttpResponse::Forbidden().body("Unauthorized user"));
    }

    let session_id = Uuid::new_v4().to_string();

    if let Err(e) = app_state.session_store.add_session(&session_id, &user) {
        error!("Failed to add session: {}", e);
        return Ok(HttpResponse::InternalServerError().body("Internal Server Error"));
    }

    debug!(
        "Current session store: {:#?}",
        app_state.session_store.sessions.lock().unwrap()
    );

    let session_cookie = actix_web::cookie::Cookie::build("session_id", session_id)
        .http_only(true)
        // .secure(true) // Ensure this is secure; only works over HTTPS in production
        .path("/") // Cookie available to the entire site
        .finish();

    info!("GitHub callback Successful - User `{}`", user.login);

    Ok(HttpResponse::Found()
        .append_header((header::LOCATION, login_redirect))
        .cookie(session_cookie)
        .finish())
}
