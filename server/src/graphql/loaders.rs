use async_graphql::dataloader::Loader;
use diesel::prelude::*;
use std::collections::HashMap;

use crate::{db::DbPool, models::Entry};

pub struct EntryLoader {
    pub db_pool: DbPool,
}

impl Loader<i32> for EntryLoader {
    type Value = Vec<Entry>;
    type Error = String;

    async fn load(&self, keys: &[i32]) -> Result<HashMap<i32, Self::Value>, Self::Error> {
        use crate::schema::entries::dsl;

        let mut connection = self.db_pool.get().map_err(|e| e.to_string())?;

        // Fetch all entries where `parent_id` is in `keys`
        let results: Vec<Entry> = dsl::entries
            .filter(dsl::parent_id.eq_any(keys))
            .load(&mut connection)
            .map_err(|e| e.to_string())?;

        // Group results by parent_id
        let mut grouped_entries: HashMap<i32, Vec<Entry>> = HashMap::new();
        for entry in results {
            if let Some(parent_id) = entry.parent_id {
                grouped_entries
                    .entry(parent_id)
                    .or_insert_with(Vec::new)
                    .push(entry);
            }
        }

        Ok(grouped_entries)
    }
}

// let loader = ctx.data::<DataLoader<EntryLoader>>()?;
// let entries_result = loader.load_one(root_id).await.map_err(|e| {
//     async_graphql::Error::new(format!(
//         "Failed to load entries for parent_id {}: {}",
//         root_id, e
//     ))
// })?;
