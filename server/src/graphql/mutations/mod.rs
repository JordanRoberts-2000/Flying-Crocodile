use async_graphql::MergedObject;
use entries::EntryMutation;

mod entries;

#[derive(MergedObject, Default)]
pub struct RootMutation(EntryMutation);
// pub struct RootMutation(EntryMutation, EntryRootMutation);
