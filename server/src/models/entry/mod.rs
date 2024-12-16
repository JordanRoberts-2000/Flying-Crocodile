pub mod inputs;
pub mod outputs;

use async_graphql::SimpleObject;
use diesel::prelude::*;
use log::debug;

use crate::schema::entries;

use super::NewEntry;

#[derive(Queryable, serde::Serialize, SimpleObject, Clone, Debug)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub parent_id: Option<i32>,
    pub root_id: Option<i32>,
    pub is_folder: bool,
}

impl Entry {
    pub fn create_root(conn: &mut PgConnection, root_name: &str) -> Result<Self, String> {
        let new_entry = NewEntry {
            title: root_name.to_string(),
            parent_id: None,
            root_id: None,
            is_folder: true,
        };

        let inserted_entry = diesel::insert_into(entries::table)
            .values(&new_entry)
            .returning(entries::all_columns)
            .get_result::<Entry>(conn)
            .map_err(|e| {
                format!(
                    "Error inserting root entry `{}` into the database: {}",
                    root_name, e
                )
            })?;

        debug!(
            "Root folder `{}` created successfully with ID {}.",
            root_name, inserted_entry.id
        );

        Ok(inserted_entry)
    }

    pub fn delete_root(conn: &mut PgConnection, root_id: i32) -> Result<Self, String> {
        let deleted_entry: Entry = diesel::delete(entries::table.filter(entries::id.eq(root_id)))
            .returning(entries::all_columns)
            .get_result(conn)
            .map_err(|e| {
                format!(
                    "Failed to delete root entry with id `{}` from the database: {}",
                    root_id, e
                )
            })?;

        debug!(
            "Root folder `{}` deleted successfully with ID {}.",
            deleted_entry.title, deleted_entry.id
        );

        Ok(deleted_entry)
    }

    pub fn rename_root(
        conn: &mut PgConnection,
        current_title: &str,
        new_title: &str,
    ) -> Result<Self, String> {
        let updated_entry: Entry = diesel::update(
            entries::table
                .filter(entries::title.eq(current_title))
                .filter(entries::parent_id.is_null()),
        )
        .set(entries::title.eq(new_title))
        .returning(entries::all_columns)
        .get_result(conn)
        .map_err(|e| {
            format!(
                "Failed to rename root entry `{}` to `{}`: {}",
                current_title, new_title, e
            )
        })?;

        debug!(
            "Root folder `{}` successfully renamed to `{}` with ID {}.",
            current_title, new_title, updated_entry.id
        );

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
}
