use async_graphql::MergedObject;
use auth::admin_check::AdminCheckQuery;
use entries::{get_entries::GetEntriesQuery, get_roots::GetRootsQuery};

pub mod auth;
pub mod entries;

#[derive(MergedObject, Default)]
pub struct RootQuery(GetEntriesQuery, GetRootsQuery, AdminCheckQuery);
