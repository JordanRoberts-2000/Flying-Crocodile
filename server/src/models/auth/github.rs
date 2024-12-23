use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct GitHubCallbackQueryParams {
    pub code: String,
    pub state: Option<String>, // State for CSRF protection
}

#[allow(dead_code)]
#[derive(Deserialize)]
pub struct GitHubAccessTokenResponse {
    pub access_token: String,
    token_type: String,
}

#[derive(Deserialize, Clone, Debug, Serialize, SimpleObject)]
pub struct GitHubUser {
    pub login: String,
    pub name: Option<String>,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
}
