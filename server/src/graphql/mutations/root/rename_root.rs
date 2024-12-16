use crate::{models::Entry, services::root::RootService, utils::get_app_state::get_app_state};
use async_graphql::{Context, Result};
use log::{error, info};
use std::time::Instant;

pub async fn rename_root(ctx: &Context<'_>, old_title: String, new_title: String) -> Result<Entry> {
    let mutation_title = "RenameRootMutation";
    let start_time = Instant::now();

    info!("{mutation_title} hit - Renaming root with title: {old_title}, to: {new_title}");

    let app_state = get_app_state(ctx, mutation_title)?;

    let result = RootService::rename_root(&app_state, &old_title, &new_title).map_err(|e| {
        error!("{mutation_title} - Failed to rename root `{old_title}`: {e}");
        async_graphql::Error::new("Internal server error")
    })?;

    info!(
        "{mutation_title} Successful - Root: `{old_title}` renamed to '{new_title}', in {:?}",
        start_time.elapsed()
    );

    Ok(result)
}
