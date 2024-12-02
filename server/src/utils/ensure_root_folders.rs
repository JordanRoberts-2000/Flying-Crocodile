use crate::db::DbPool;
use crate::models::{Entry, NewEntry};
use crate::schema::entries;
use crate::schema::entries::dsl::*;
use diesel::prelude::*;
use log::{debug, info};

pub fn ensure_root_folders(db_pool: &DbPool) -> Result<(), String> {
    let root_folders = ["public", "private"];

    for folder in &root_folders {
        match check_if_entry_exists(db_pool, folder)
            .map_err(|e| format!("Failed to check existence of folder `{}`: {}", folder, e))?
        {
            true => debug!("Root folder `{}` already exists.", folder),
            false => create_entry(db_pool, folder)
                .map_err(|e| format!("Error creating root folder `{}`: {}", folder, e))?,
        }
    }
    Ok(())
}

pub fn check_if_entry_exists(db_pool: &DbPool, entry_name: &str) -> Result<bool, String> {
    let mut connection = db_pool.get().map_err(|e| {
        format!(
            "Failed to get DB connection from pool while checking entry `{}`: {}",
            entry_name, e
        )
    })?;

    let result = entries
        .filter(title.eq(entry_name))
        .filter(parent_id.is_null())
        .get_result::<Entry>(&mut connection);

    match result {
        Ok(_) => Ok(true),
        Err(diesel::result::Error::NotFound) => Ok(false),
        Err(e) => Err(format!(
            "Error querying existence of entry `{}`: {}",
            entry_name, e
        )),
    }
}

pub fn create_entry(db_pool: &DbPool, entry_name: &str) -> Result<(), String> {
    let mut connection = db_pool.get().map_err(|e| {
        format!(
            "Failed to get DB connection from pool while creating entry `{}`: {}",
            entry_name, e
        )
    })?;

    let new_entry = NewEntry {
        title: entry_name.to_string(),
        parent_id: None,
        is_folder: true,
    };

    diesel::insert_into(entries::table)
        .values(&new_entry)
        .execute(&mut connection)
        .map_err(|e| {
            format!(
                "Error inserting entry `{}` into the database: {}",
                entry_name, e
            )
        })?;

    info!("Root folder `{}` created successfully.", entry_name);
    Ok(())
}
