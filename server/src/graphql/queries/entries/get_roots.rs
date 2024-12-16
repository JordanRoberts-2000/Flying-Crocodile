use crate::utils::get_app_state::get_app_state;
use async_graphql::{Context, Object, Result};
use log::{error, info};
use std::time::Instant;

#[derive(Default)]
pub struct GetRootsQuery;

#[Object]
impl GetRootsQuery {
    async fn get_roots(&self, ctx: &Context<'_>) -> Result<Vec<String>> {
        let query_title = "GetRootsQuery";
        let start_time = Instant::now();

        info!("{query_title} hit - Getting roots");

        let app_state = get_app_state(ctx, query_title)?;

        let roots = app_state.cache.root.get_roots().map_err(|e| {
            error!("{query_title} - Failed to get roots: {e}");
            async_graphql::Error::new("Internal server error")
        })?;

        info!(
            "{query_title} Successful - {} roots retrieved, completed in {:?}",
            roots.len(),
            start_time.elapsed()
        );

        Ok(roots)
    }
}
