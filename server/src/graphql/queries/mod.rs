use async_graphql::MergedObject;
use entries::{get_folder_entries::FolderQuery, get_roots::GetRootsQuery};

pub mod entries;

#[derive(MergedObject, Default)]
pub struct RootQuery(FolderQuery, GetRootsQuery);
