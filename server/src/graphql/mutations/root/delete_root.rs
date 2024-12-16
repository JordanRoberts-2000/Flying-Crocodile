use crate::{models::Entry, services::root::RootService, utils::get_app_state::get_app_state};
use async_graphql::{Context, Result};
use log::{error, info};
use std::time::Instant;

pub async fn delete_root(ctx: &Context<'_>, root_title: String) -> Result<Entry> {
    let mutation_title = "DeleteRootMutation";
    let start_time = Instant::now();

    info!("{mutation_title} hit - Deleting root with title: {root_title}");

    let app_state = get_app_state(ctx, mutation_title)?;

    let result = RootService::delete_root(&app_state, &root_title).map_err(|e| {
        error!("{mutation_title} - Failed to delete root `{root_title}`: {e}");
        async_graphql::Error::new("Internal server error")
    })?;

    info!(
        "{mutation_title} Successful - Root: `{root_title}`, completed in {:?}",
        start_time.elapsed()
    );

    Ok(result)
}
