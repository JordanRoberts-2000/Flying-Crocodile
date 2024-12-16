use async_graphql::MergedObject;
use entry::EntryMutation;
use root::EntryRootMutation;

mod entry;
mod root;

#[derive(MergedObject, Default)]
pub struct RootMutation(EntryMutation, EntryRootMutation);
