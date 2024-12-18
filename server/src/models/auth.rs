use serde::Deserialize;

#[derive(Deserialize)]
pub struct GitHubCallbackQueryParams {
    pub code: String,
    pub state: Option<String>, // State for CSRF protection
}

/// GitHub OAuth Access Token Response
#[allow(dead_code)]
#[derive(Deserialize)]
pub struct GitHubAccessTokenResponse {
    pub access_token: String,
    token_type: String,
}

/// GitHub User Information Response
#[derive(Deserialize)]
pub struct GitHubUserResponse {
    pub login: String,
    pub name: Option<String>,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
}
