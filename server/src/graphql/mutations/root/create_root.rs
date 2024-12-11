use crate::models::Entry;
use crate::utils::get_app_state::get_app_state;
use async_graphql::{Context, Object, Result};
use log::{error, info};
use std::time::Instant;

use super::EntryRootMutation;

#[Object]
impl EntryRootMutation {
    async fn create_root(&self, ctx: &Context<'_>, new_root_title: String) -> Result<Entry> {
        let start_time = Instant::now();

        info!(
            "CreateRootMutation hit - Creating root with title: {}",
            new_root_title
        );

        let mut app_state = get_app_state(ctx, "CreateRootMutation")?;

        let result = app_state
            .root_manager
            .create_root(&new_root_title)
            .map_err(|e| {
                error!(
                    "CreateRootMutation - Failed to create root `{}`: {}",
                    new_root_title, e
                );
                async_graphql::Error::new("Internal server error")
            })?;

        info!(
            "CreateRootMutation Successful - Root: `{}`, created in {:?}",
            new_root_title,
            start_time.elapsed()
        );

        Ok(result)
    }
}
