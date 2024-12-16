use async_graphql::MergedObject;
use entries::{get_entries::GetEntriesQuery, get_roots::GetRootsQuery};

pub mod entries;

#[derive(MergedObject, Default)]
pub struct RootQuery(GetEntriesQuery, GetRootsQuery);
