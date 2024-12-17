use crate::{
    models::{Entry, MoveEntryInput},
    services::entries::EntryService,
    utils::get_app_state::get_app_state,
};
use async_graphql::{Context, Result};
use log::{error, info};
use std::time::Instant;

pub async fn move_entry(ctx: &Context<'_>, input: MoveEntryInput) -> Result<Entry> {
    let mutation_title = "MoveEntryMutation";
    let start_time = Instant::now();

    info!(
        "{mutation_title} hit - Moving entry with ID: {}, to new parent ID: {}",
        input.entry_id, input.new_parent_id
    );

    let app_state = get_app_state(ctx, mutation_title)?;

    let result = EntryService::move_entry(&app_state, &input).map_err(|e| {
        error!(
            "{mutation_title} - Failed to move entry with ID: {}, to new parent ID: {}: {e}",
            input.entry_id, input.new_parent_id
        );
        async_graphql::Error::new("Internal server error")
    })?;

    info!(
        "{mutation_title} Successful - Entry with ID: {} moved to parent ID: {}, completed in {:?}",
        input.entry_id,
        input.new_parent_id,
        start_time.elapsed()
    );

    Ok(result)
}
