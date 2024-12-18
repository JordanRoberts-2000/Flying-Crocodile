use actix_web::{web, Error, HttpResponse};
use log::{error, info};

use crate::{
    models::auth::{GitHubAccessTokenResponse, GitHubCallbackQueryParams, GitHubUserResponse},
    utils::env::get_env_var,
};

pub async fn github_callback(
    query: web::Query<GitHubCallbackQueryParams>,
) -> Result<HttpResponse, Error> {
    info!("GitHub callback hit");

    let github_client_id = get_env_var("GITHUB_CLIENT_ID")?;
    let github_client_secret = get_env_var("GITHUB_CLIENT_SECRET")?;

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

    let body = token_response
        .text()
        .await
        .unwrap_or_else(|_| "Failed to read body".to_string());
    error!("GitHub callback - Access token response body: {}", body);

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
        Ok(resp) => match resp.json::<GitHubUserResponse>().await {
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

    info!(
        "GitHub callback Successful - User `{}` with email `{}`",
        user.login,
        user.email.clone().unwrap_or_else(|| "N/A".to_string())
    );

    // Step 3: Respond to the client
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "GitHub OAuth successful",
        "user": {
            "username": user.login,
            "name": user.name.unwrap_or_default(),
            "email": user.email.unwrap_or_default(),
            "avatar_url": user.avatar_url.unwrap_or_default()
        }
    })))
}
