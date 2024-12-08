use crate::models::Entry;
use crate::schema::entries::dsl;
use crate::{db::DbPool, schema::entries};
use actix_web::web;
use async_graphql::{Context, InputObject, Object, Result};
use diesel::prelude::*;
use log::{error, info};
use validator::Validate;

// recieve folder id
// check if string is a existing folder
// fetch the folders children
// return data like {folderId: [{id: 3, title: "example", isFolder: true}, ...]}

#[derive(InputObject, Validate)]
pub struct GetEntriesInput {
    #[validate(range(min = 1, message = "parent_id must be a positive integer"))]
    pub parent_id: i32,
}

#[derive(Default)]
pub struct EntryQuery;

#[Object]
impl EntryQuery {
    async fn get_folder_entries(
        &self,
        ctx: &Context<'_>,
        input: GetEntriesInput,
    ) -> Result<Vec<Entry>, async_graphql::Error> {
        info!(
            "GraphQL Query: get_entries hit - with parent_id: {}",
            input.parent_id
        );

        if let Err(errors) = input.validate() {
            error!(
                "GraphQL Query: get_entries validation failed - errors: {:?}",
                errors
            );
            return Err(async_graphql::Error::new(format!(
                "Validation failed: {:?}",
                errors
            )));
        }

        let pool = match ctx.data::<DbPool>() {
            Ok(pool) => pool.clone(),
            Err(_) => {
                error!("GraphQL Query: get_entries failed for parent_id: {} - error: Failed to get db_pool from context", input.parent_id);
                return Err(async_graphql::Error::new(
                    "Failed to retrieve database pool from context",
                ));
            }
        };

        let entries_result = web::block(move || {
            let mut connection = pool.get().map_err(|e| {
                diesel::result::Error::DatabaseError(
                    diesel::result::DatabaseErrorKind::UnableToSendCommand,
                    Box::new(format!("Connection error: {}", e)),
                )
            })?;

            dsl::entries
                .filter(entries::parent_id.eq(input.parent_id))
                .load::<Entry>(&mut connection)
        })
        .await
        .map_err(|_| async_graphql::Error::new("Database operation failed"))?;

        let entries = match entries_result {
            Ok(entries) => entries,
            Err(err) => {
                error!(
                    "GraphQL Query: get_entries failed for parent_id: {} - error: {:?}",
                    input.parent_id, err
                );
                return Err(err.into());
            }
        };

        info!(
            "GraphQL Query: get_entries succeeded - fetched {} entries for parent_id: {}",
            entries.len(),
            input.parent_id
        );

        Ok(entries)
    }
}
