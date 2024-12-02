use crate::graphql::query::entries::{get_entries::EntryQuery, get_root_entires::RootEntryQuery};
use async_graphql::MergedObject;

pub mod entries;

#[derive(MergedObject, Default)]
pub struct RootQuery(EntryQuery, RootEntryQuery);
