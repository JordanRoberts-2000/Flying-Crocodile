use crate::graphql::query::entries::get_initial_entires::InitialEntriesQuery;
use async_graphql::MergedObject;

pub mod entries;

#[derive(MergedObject, Default)]
// pub struct RootQuery(EntryQuery, RootEntryQuery);
pub struct RootQuery(InitialEntriesQuery);
