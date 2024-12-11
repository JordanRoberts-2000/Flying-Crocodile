use async_graphql::MergedObject;
use entries::{get_categories::CategoriesQuery, get_folder_entries::FolderQuery};

pub mod entries;

#[derive(MergedObject, Default)]
pub struct RootQuery(FolderQuery, CategoriesQuery);
