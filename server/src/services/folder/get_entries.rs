use crate::models::{Entry, MinimalEntry};
use crate::schema::entries::dsl;
use diesel::prelude::*;

use super::FolderManager;

impl FolderManager {
    pub fn get_entries(
        &self,
        parent_id: Option<i32>,
        root_title: &str,
    ) -> Result<(i32, Vec<MinimalEntry>), String> {
        let mut conn = self
            .db_pool
            .get()
            .map_err(|e| format!("Failed to get DB connection from pool: {}", e))?;

        if let Some(parent_id) = parent_id {
            // Check if the folder exists
            let is_folder_exists = dsl::entries
                .filter(dsl::id.eq(parent_id))
                .filter(dsl::is_folder.eq(true))
                .count()
                .get_result::<i64>(&mut conn)
                .map_err(|e| format!("Failed to query folder_id {}: {}", parent_id, e))?;

            if is_folder_exists == 0 {
                return Err(format!("Folder with ID {} not found", parent_id));
            }

            // Fetch entries for the folder
            let entries = dsl::entries
                .filter(dsl::parent_id.eq(parent_id))
                .load::<Entry>(&mut conn)
                .map_err(|e| format!("Failed to query entries for folder_id {}: {}", parent_id, e))?
                .into_iter()
                .map(|entry| MinimalEntry {
                    id: entry.id,
                    title: entry.title,
                    is_folder: entry.is_folder,
                })
                .collect();

            Ok((parent_id, entries))
        } else {
            // Fetch root folder ID
            let root_id = dsl::entries
                .filter(dsl::title.eq(root_title))
                .filter(dsl::parent_id.is_null())
                .select(dsl::id)
                .get_result::<i32>(&mut conn)
                .map_err(|e| {
                    format!(
                        "Failed to query entries for root_title '{}': {}",
                        root_title, e
                    )
                })?;

            // Fetch entries for the root folder
            let entries = dsl::entries
                .filter(dsl::parent_id.eq(Some(root_id)))
                .load::<Entry>(&mut conn)
                .map_err(|e| format!("Failed to query entries for root_id {}: {}", root_id, e))?
                .into_iter()
                .map(|entry| MinimalEntry {
                    id: entry.id,
                    title: entry.title,
                    is_folder: entry.is_folder,
                })
                .collect();

            Ok((root_id, entries))
        }
    }
}
