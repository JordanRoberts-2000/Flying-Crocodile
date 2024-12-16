use crate::models::Entry;
use async_graphql::{Context, Object, Result};

mod create_root;
mod delete_root;
mod rename_root;

#[derive(Default)]
pub struct EntryRootMutation;

#[Object]
impl EntryRootMutation {
    async fn create_root(&self, ctx: &Context<'_>, new_root_title: String) -> Result<Entry> {
        create_root::create_root(ctx, new_root_title).await
    }

    async fn delete_root(&self, ctx: &Context<'_>, root_title: String) -> Result<Entry> {
        delete_root::delete_root(ctx, root_title).await
    }

    async fn rename_root(
        &self,
        ctx: &Context<'_>,
        old_title: String,
        new_title: String,
    ) -> Result<Entry> {
        rename_root::rename_root(ctx, old_title, new_title).await
    }
}
