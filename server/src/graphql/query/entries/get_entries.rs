use crate::models::Entry;
use crate::schema::entries::dsl;
use crate::{db::DbPool, schema::entries};
use actix_web::web;
use async_graphql::{Context, Object, Result};
use diesel::prelude::*;
use log::{error, info};

#[derive(Default)]
pub struct EntryQuery;

#[Object]
impl EntryQuery {
    async fn get_entries(
        &self,
        ctx: &Context<'_>,
        parent_id: Option<i32>,
    ) -> Result<Vec<Entry>, async_graphql::Error> {
        info!(
            "GraphQL Query: get_entries hit - with parent_id: {:?}",
            parent_id
        );

        let parent_id = match parent_id {
            Some(id) => id,
            None => {
                error!("GraphQL Query: get_entries failed - error: parent_id is required but was not provided.");
                return Err(async_graphql::Error::new("parent_id is required"));
            }
        };

        let pool = match ctx.data::<DbPool>() {
            Ok(pool) => pool.clone(),
            Err(_) => {
                error!("GraphQL Query: get_entries failed for parent_id: {} - error: Failed to get db_pool from context", parent_id);
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
                .filter(entries::parent_id.eq(parent_id))
                .load::<Entry>(&mut connection)
        })
        .await
        .map_err(|_| async_graphql::Error::new("Database operation failed"))?;

        let entries = match entries_result {
            Ok(entries) => entries,
            Err(err) => {
                error!(
                    "GraphQL Query: get_entries failed for parent_id: {} - error: {:?}",
                    parent_id, err
                );
                return Err(err.into());
            }
        };

        info!(
            "GraphQL Query: get_entries succeeded - fetched {} entries for parent_id: {}",
            entries.len(),
            parent_id
        );

        Ok(entries)
    }
}
