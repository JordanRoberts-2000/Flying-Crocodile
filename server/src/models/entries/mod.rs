pub mod inputs;
pub mod outputs;

use async_graphql::SimpleObject;
use diesel::prelude::*;
use log::debug;

use crate::schema::entries;

use super::{MinimalEntry, NewEntry};

#[derive(Queryable, serde::Serialize, SimpleObject, Clone, Debug)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub parent_id: Option<i32>,
    pub root_id: Option<i32>,
    pub is_folder: bool,
}

impl Entry {
    pub fn create_entry(conn: &mut PgConnection, new_entry: &NewEntry) -> Result<Self, String> {
        let inserted_entry = diesel::insert_into(entries::table)
            .values(new_entry)
            .returning(entries::all_columns)
            .get_result::<Entry>(conn)
            .map_err(|e| {
                format!(
                    "Error inserting entry `{:?}` into the database: {}",
                    new_entry, e
                )
            })?;

        debug!(
            "Entry `{}` created successfully with ID {}.",
            inserted_entry.title, inserted_entry.id
        );

        Ok(inserted_entry)
    }

    pub fn delete_entry(conn: &mut PgConnection, entry_id: i32) -> Result<Self, String> {
        let deleted_entry: Entry = diesel::delete(entries::table.filter(entries::id.eq(entry_id)))
            .returning(entries::all_columns)
            .get_result(conn)
            .map_err(|e| {
                format!(
                    "Failed to delete entry with id `{}` from the database: {}",
                    entry_id, e
                )
            })?;

        debug!(
            "Entry `{}` deleted successfully with ID {}.",
            deleted_entry.title, deleted_entry.id
        );

        Ok(deleted_entry)
    }

    pub fn rename_entry(
        conn: &mut PgConnection,
        entry_id: i32,
        new_title: &str,
    ) -> Result<Self, String> {
        let updated_entry: Entry = diesel::update(entries::table.filter(entries::id.eq(entry_id)))
            .set(entries::title.eq(new_title))
            .returning(entries::all_columns)
            .get_result(conn)
            .map_err(|e| {
                format!(
                    "Failed to rename entry with ID `{}` to `{}`: {}",
                    entry_id, new_title, e
                )
            })?;

        debug!(
            "Entry with ID `{}` successfully renamed to `{}`.",
            updated_entry.id, updated_entry.title
        );

        Ok(updated_entry)
    }

    pub fn move_entry(
        conn: &mut PgConnection,
        entry_id: i32,
        new_parent_id: i32,
    ) -> Result<Self, String> {
        // Validate that the new parent ID exists and is a folder (if required)
        let is_valid_parent = entries::table
            .filter(entries::id.eq(new_parent_id))
            .filter(entries::is_folder.eq(true))
            .select(entries::id)
            .first::<i32>(conn)
            .map_err(|_| {
                format!(
                    "Parent entry with ID `{}` does not exist or is not a folder.",
                    new_parent_id
                )
            })?;

        if is_valid_parent != new_parent_id {
            return Err(format!("Invalid parent ID: `{}`.", new_parent_id));
        }

        let updated_entry: Entry = diesel::update(entries::table.filter(entries::id.eq(entry_id)))
            .set(entries::parent_id.eq(new_parent_id))
            .returning(entries::all_columns)
            .get_result(conn)
            .map_err(|e| {
                format!(
                    "Failed to move entry with ID `{}` to parent `{}`: {}",
                    entry_id, new_parent_id, e
                )
            })?;

        Ok(updated_entry)
    }

    pub fn create_root_index(conn: &mut PgConnection, root_id: i32) -> Result<String, String> {
        let index_name = format!("idx_entries_by_root_id_{}", root_id);
        let create_index_query = format!(
            "CREATE INDEX {} ON entries (parent_id) WHERE root_id = {};",
            index_name, root_id
        );

        diesel::sql_query(create_index_query)
            .execute(conn)
            .map_err(|e| format!("Failed to create index for root_id {}: {}", root_id, e))?;

        debug!(
            "Index `{}` created successfully for root ID {}.",
            index_name, root_id
        );

        Ok(index_name)
    }

    pub fn remove_root_index(conn: &mut PgConnection, root_id: i32) -> Result<(), String> {
        let index_name = format!("idx_entries_by_root_id_{}", root_id);
        let drop_index_query = format!("DROP INDEX IF EXISTS {}; ", index_name);

        diesel::sql_query(drop_index_query)
            .execute(conn)
            .map_err(|e| {
                format!(
                    "Failed to drop index `{}` for root ID {}: {}",
                    index_name, root_id, e
                )
            })?;

        debug!(
            "Successfully dropped index `{}` for root ID {}.",
            index_name, root_id
        );

        Ok(())
    }

    pub fn get_root(conn: &mut PgConnection, title: &str) -> Result<Self, String> {
        entries::table
            .filter(entries::title.eq(title))
            .filter(entries::parent_id.is_null())
            .first::<Entry>(conn)
            .map_err(|e| format!("Error querying root entry `{}` from database: {}", title, e))
    }

    pub fn get_entries(
        conn: &mut PgConnection,
        folder_id: i32,
    ) -> Result<Vec<MinimalEntry>, String> {
        let entries = entries::table
            .filter(entries::parent_id.eq(Some(folder_id)))
            .load::<Entry>(conn)
            .map_err(|e| {
                format!(
                    "Failed to query entries for folder with ID {}: {}",
                    folder_id, e
                )
            })?
            .into_iter()
            .map(|entry| MinimalEntry {
                id: entry.id,
                title: entry.title,
                is_folder: entry.is_folder,
            })
            .collect();

        Ok(entries)
    }
}
