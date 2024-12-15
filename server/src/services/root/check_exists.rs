use crate::db::DbPool;
use crate::models::Entry;
use crate::schema::entries::dsl::{entries, parent_id, title};
use diesel::prelude::*;

use super::RootService;

impl RootService {
    pub fn check_exists(db_pool: &DbPool, root_name: &str) -> Result<bool, String> {
        let mut connection = db_pool.get().map_err(|e| {
            format!(
                "Failed to get DB connection from pool while checking entry `{}`: {}",
                root_name, e
            )
        })?;

        let result = entries
            .filter(title.eq(root_name))
            .filter(parent_id.is_null())
            .get_result::<Entry>(&mut connection);

        match result {
            Ok(_) => Ok(true),
            Err(diesel::result::Error::NotFound) => Ok(false),
            Err(e) => Err(format!(
                "Error querying existence of entry `{}`: {}",
                root_name, e
            )),
        }
    }
}
