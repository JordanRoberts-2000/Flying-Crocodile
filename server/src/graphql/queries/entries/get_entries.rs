use crate::models::{GetEntriesInput, GetEntriesResponse};
use crate::services::entries::EntryService;
use crate::utils::get_app_state::get_app_state;
use async_graphql::{Context, Object, Result};
use log::{error, info};
use std::time::Instant;

#[derive(Default)]
pub struct GetEntriesQuery;

#[Object]
impl GetEntriesQuery {
    async fn get_entries(
        &self,
        ctx: &Context<'_>,
        input: GetEntriesInput,
    ) -> Result<GetEntriesResponse> {
        let query_title = "GetEntriesQuery";
        let start_time = Instant::now();

        info!("{query_title} hit - Getting entries");

        let app_state = get_app_state(ctx, query_title)?;

        let (folder_id, entries) = EntryService::get_entries(&app_state, &input).map_err(|e| {
            error!(
                "{query_title} - Failed to get entries from id '{:?}' and tite '{}': {e}",
                input.folder_id, input.root_title
            );
            async_graphql::Error::new("Internal server error")
        })?;

        info!(
            "{query_title} Successful - {} entries retrieved, completed in {:?}",
            entries.len(),
            start_time.elapsed()
        );

        Ok(GetEntriesResponse { folder_id, entries })
    }
}
