use crate::db::DbPool;
use crate::models::{Entry, NewEntry};
use crate::schema::entries;
use crate::schema::entries::dsl::*;
use diesel::prelude::*;

pub fn initialize_root_folders(db: &DbPool) {
    let root_folders = vec!["fonts", "notes", "gallery"];

    for folder in root_folders {
        if !check_if_entry_exists(db, folder) {
            match create_entry(db, folder) {
                Ok(_) => println!("Root folder `{}` created.", folder),
                Err(e) => println!("Error creating folder `{}`: {:?}", folder, e),
            }
        }
    }
}

pub fn check_if_entry_exists(db: &DbPool, entry_name: &str) -> bool {
    let mut connection = db.get().expect("Failed to get DB connection from pool");
    entries
        .filter(title.eq(entry_name))
        .filter(parent_id.is_null())
        .get_result::<Entry>(&mut connection)
        .is_ok()
}

pub fn create_entry(db: &DbPool, entry_name: &str) -> Result<(), diesel::result::Error> {
    let mut connection = db.get().expect("Failed to get DB connection from pool");

    let new_entry = NewEntry {
        title: entry_name.to_string(),
        parent_id: None,
        is_folder: true,
    };

    diesel::insert_into(entries::table)
        .values(&new_entry)
        .execute(&mut connection)?;

    Ok(())
}
