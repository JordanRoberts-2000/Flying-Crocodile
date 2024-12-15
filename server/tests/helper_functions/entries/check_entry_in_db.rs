use diesel::prelude::*;
use my_project::models::Entry;
use my_project::schema::entries::dsl::*;

pub fn check_entry_in_db(connection: &mut PgConnection, entry_id: i32) -> Result<Entry, String> {
    entries
        .filter(id.eq(entry_id))
        .first::<Entry>(connection)
        .map_err(|e| {
            if let diesel::result::Error::NotFound = e {
                format!("Entry with ID {} not found", entry_id)
            } else {
                format!("Failed to query entry with ID {}: {}", entry_id, e)
            }
        })
}
