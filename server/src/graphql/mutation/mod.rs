use async_graphql::MergedObject;
use category_mutations::CategoryMutation;
use entry_mutation::EntryMutation;

mod category_mutations;
mod entry_mutation;

#[derive(MergedObject, Default)]
pub struct RootMutation(EntryMutation, CategoryMutation);
