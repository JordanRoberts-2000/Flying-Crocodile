use async_graphql::MergedObject;
use entry_mutation::EntryMutation;
use root::EntryRootMutation;

mod entry_mutation;
mod root;

#[derive(MergedObject, Default)]
pub struct RootMutation(EntryMutation, EntryRootMutation);
