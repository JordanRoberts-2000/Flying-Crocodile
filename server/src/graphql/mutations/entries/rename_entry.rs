use crate::{
    models::{Entry, RenameEntryInput},
    services::entries::EntryService,
    utils::get_app_state::get_app_state,
};
use async_graphql::{Context, Result};
use log::{error, info};
use std::time::Instant;

pub async fn rename_entry(ctx: &Context<'_>, input: RenameEntryInput) -> Result<Entry> {
    let mutation_title = "RenameEntryMutation";
    let start_time = Instant::now();

    info!(
        "{mutation_title} hit - Renaming entry with ID: {:?}, root title: '{}', to new title: '{}'",
        input.entry_id, input.root_title, input.new_title
    );

    let app_state = get_app_state(ctx, mutation_title)?;

    let result = EntryService::rename_entry(&app_state, &input).map_err(|e| {
        error!(
            "{mutation_title} - Failed to rename entry with ID: {:?}, root title: '{}': {e}",
            input.entry_id, input.root_title
        );
        async_graphql::Error::new("Internal server error")
    })?;

    info!(
      "{mutation_title} Successful - Entry with ID: {:?}, root title: '{}' renamed to '{}', completed in {:?}",
      input.entry_id, input.root_title, input.new_title, start_time.elapsed()
  );

    Ok(result)
}
