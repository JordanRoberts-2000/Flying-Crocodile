use async_graphql::SimpleObject;

#[derive(SimpleObject)]
pub struct GetEntriesResponse {
    pub folder_id: i32,
    pub entries: Vec<MinimalEntry>,
}

#[derive(SimpleObject)]
pub struct MinimalEntry {
    pub id: i32,
    pub title: String,
    pub is_folder: bool,
}
