use crate::db::DbPool;

mod get_entries;

pub struct FolderManager {
    pub db_pool: DbPool,
}

impl FolderManager {
    pub fn new(db_pool: &DbPool) -> Self {
        Self {
            db_pool: db_pool.clone(),
        }
    }
}
