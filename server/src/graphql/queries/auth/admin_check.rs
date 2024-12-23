use crate::models::auth::github::GitHubUser;
use crate::models::auth::outputs::AdminCheckResponse;
use async_graphql::{Context, Object, Result};
use log::error;

#[derive(Default)]
pub struct AdminCheckQuery;

#[Object]
impl AdminCheckQuery {
    async fn admin_check(&self, ctx: &Context<'_>) -> Result<AdminCheckResponse> {
        let user = ctx.data::<Option<GitHubUser>>().map_err(|e| {
            error!("Failed to retrieve Admin from context: {:?}", e);
            async_graphql::Error::new("Internal server error")
        })?;

        if user.is_none() {
            return Ok(AdminCheckResponse { admin: None });
        }

        Ok(AdminCheckResponse {
            admin: user.clone(),
        })
    }
}
