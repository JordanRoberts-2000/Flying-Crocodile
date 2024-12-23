use async_graphql::SimpleObject;

use super::github::GitHubUser;

#[derive(SimpleObject)]
pub struct AdminCheckResponse {
    pub admin: Option<GitHubUser>,
}
