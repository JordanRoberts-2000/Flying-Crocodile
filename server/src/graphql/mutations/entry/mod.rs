pub mod create_entry;
pub mod delete_entry;
pub mod move_entry;
pub mod rename_entry;

use crate::models::{CreateEntryInput, Entry};
use async_graphql::{Context, Object, Result};

#[derive(Default)]
pub struct EntryMutation;

#[Object]
impl EntryMutation {
    async fn create_entry(&self, ctx: &Context<'_>, input: CreateEntryInput) -> Result<Entry> {
        create_entry::create_entry(ctx, input).await
    }
}
