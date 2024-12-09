use crate::{models::Entry, schema::entries};
use diesel::prelude::*;

use super::RootManager;

impl RootManager {
    pub fn get_root(&self, folder_name: &str) -> Result<Entry, String> {
        let mut connection = self.db_pool.get().map_err(|e| {
            format!(
                "Failed to get DB connection from pool while retrieving root `{}`: {}",
                folder_name, e
            )
        })?;

        let result = entries::table
            .filter(entries::title.eq(folder_name))
            .filter(entries::parent_id.is_null())
            .first::<Entry>(&mut connection)
            .map_err(|e| {
                format!(
                    "Error querying root entry `{}` from database: {}",
                    folder_name, e
                )
            })?;

        Ok(result)
    }
}
