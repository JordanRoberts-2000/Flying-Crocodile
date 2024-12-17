pub mod create_entry;
pub mod delete_entry;
pub mod move_entry;
pub mod rename_entry;

use crate::models::{CreateEntryInput, DeleteEntryInput, Entry, RenameEntryInput};
use async_graphql::{Context, Object, Result};

#[derive(Default)]
pub struct EntryMutation;

#[Object]
impl EntryMutation {
    async fn create_entry(&self, ctx: &Context<'_>, input: CreateEntryInput) -> Result<Entry> {
        create_entry::create_entry(ctx, input).await
    }

    async fn delete_entry(&self, ctx: &Context<'_>, input: DeleteEntryInput) -> Result<Entry> {
        delete_entry::delete_entry(ctx, input).await
    }

    async fn rename_entry(&self, ctx: &Context<'_>, input: RenameEntryInput) -> Result<Entry> {
        rename_entry::rename_entry(ctx, input).await
    }
}
