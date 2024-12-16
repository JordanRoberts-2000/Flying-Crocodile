use crate::{models::Entry, state::AppState};

use super::RootService;

impl RootService {
    pub fn get_root(app_state: &AppState, title: &str) -> Result<Entry, String> {
        let mut conn = app_state
            .db_pool
            .get()
            .map_err(|e| format!("Failed to get DB connection from pool: {}", e))?;

        let result = Entry::get_root(&mut conn, title)?;

        Ok(result)
    }
}
