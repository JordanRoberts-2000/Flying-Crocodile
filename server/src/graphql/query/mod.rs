use async_graphql::MergedObject;
use entry_query::{EntryQuery, RootEntryQuery};

pub mod entry_query;

#[derive(MergedObject, Default)]
pub struct RootQuery(EntryQuery, RootEntryQuery);
