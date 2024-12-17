use crate::{
    models::{DeleteEntryInput, Entry},
    services::entries::EntryService,
    utils::get_app_state::get_app_state,
};
use async_graphql::{Context, Result};
use log::{error, info};
use std::time::Instant;

pub async fn delete_entry(ctx: &Context<'_>, input: DeleteEntryInput) -> Result<Entry> {
    let mutation_title = "DeleteEntryMutation";
    let start_time = Instant::now();

    info!(
        "{mutation_title} hit - Deleting Entry with id '{:?}' and root title '{}'",
        input.entry_id, input.root_title
    );

    let app_state = get_app_state(ctx, mutation_title)?;

    let result = EntryService::delete_entry(&app_state, &input).map_err(|e| {
        error!(
            "{mutation_title} - Failed to entry with id '{:?}' and root title '{}': {e}",
            input.entry_id, input.root_title
        );
        async_graphql::Error::new("Internal server error")
    })?;

    info!(
        "{mutation_title} Successful - Deleted Entry with id '{:?}' and root title '{}', completed in {:?}",
        input.entry_id,
        input.root_title,
        start_time.elapsed()
    );

    Ok(result)
}
