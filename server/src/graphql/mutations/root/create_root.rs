use crate::{models::Entry, services::root::RootService, utils::get_app_state::get_app_state};
use async_graphql::{Context, Result};
use log::{error, info};
use std::time::Instant;

pub async fn create_root(ctx: &Context<'_>, new_root_title: String) -> Result<Entry> {
    let mutation_title = "CreateRootMutation";
    let start_time = Instant::now();

    info!("{mutation_title} hit - Creating root with title: {new_root_title}");

    let app_state = get_app_state(ctx, mutation_title)?;

    let result = RootService::create_root(&app_state, &new_root_title).map_err(|e| {
        error!("{mutation_title} - Failed to create root `{new_root_title}`: {e}");
        async_graphql::Error::new("Internal server error")
    })?;

    info!(
        "{mutation_title} Successful - Root: `{new_root_title}`, completed in {:?}",
        start_time.elapsed()
    );

    Ok(result)
}
