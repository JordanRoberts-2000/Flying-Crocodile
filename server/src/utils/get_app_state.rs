use log::error;
use std::sync::Arc;

use crate::AppState;

pub fn get_app_state(
    ctx: &async_graphql::Context<'_>,
    title: &str,
) -> Result<Arc<AppState>, async_graphql::Error> {
    ctx.data::<Arc<AppState>>()
        .map_err(|e| {
            error!(
                "{} Failed to retrieve AppState from context: {:?}",
                title, e
            );
            async_graphql::Error::new("Internal server error")
        })
        .cloned()
}
