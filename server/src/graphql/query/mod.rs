use async_graphql::MergedObject;
use entry_query::EntryQuery;

pub mod entry_query;

#[derive(MergedObject, Default)]
pub struct RootQuery(EntryQuery);
