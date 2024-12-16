use crate::{
    models::{CreateEntryInput, Entry},
    services::entry::EntryService,
    utils::get_app_state::get_app_state,
};
use async_graphql::{Context, Result};
use log::{error, info};
use std::time::Instant;

pub async fn create_entry(ctx: &Context<'_>, input: CreateEntryInput) -> Result<Entry> {
    let mutation_title = "CreateEntryMutation";
    let start_time = Instant::now();

    info!(
        "{mutation_title} hit - Creating entry with title: {:?}",
        input.title
    );

    let app_state = get_app_state(ctx, mutation_title)?;

    let result = EntryService::create_entry(&app_state, &input).map_err(|e| {
        error!(
            "{mutation_title} - Failed to create entry `{:?}`: {e}",
            input.title
        );
        async_graphql::Error::new("Internal server error")
    })?;

    info!(
        "{mutation_title} Successful - Entry added with title `{}`, completed in {:?}",
        input.title,
        start_time.elapsed()
    );

    Ok(result)
}
