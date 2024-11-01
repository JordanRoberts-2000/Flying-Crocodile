use async_graphql::MergedObject;
use entry_mutation::EntryMutation;

mod entry_mutation;

#[derive(MergedObject, Default)]
pub struct RootMutation(EntryMutation);
