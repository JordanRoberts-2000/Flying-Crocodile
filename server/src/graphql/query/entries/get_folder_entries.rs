use crate::models::{Entry, FolderQueryInput, FolderQueryResponse, MinimalEntry};
use crate::schema::entries::dsl;
use crate::AppState;
use async_graphql::{Context, Object, Result};
use diesel::prelude::*;
use log::{error, info};
use std::sync::Arc;
use validator::Validate;

#[derive(Default)]
pub struct FolderQuery;

#[Object]
impl FolderQuery {
    async fn get_folder_entries(
        &self,
        ctx: &Context<'_>,
        input: FolderQueryInput,
    ) -> Result<FolderQueryResponse> {
        info!(
            "FolderQuery hit - with root: {}, and folder id: {:?}",
            input.root_title, input.folder_id
        );

        let app_state = match ctx.data::<Arc<AppState>>() {
            Ok(app_state) => app_state,
            Err(e) => {
                error!(
                    "FolderQuery Error - Failed to retrieve AppState from context: {:?}",
                    e
                );
                return Err(async_graphql::Error::new("Internal server error"));
            }
        };

        let pool = app_state.db_pool.clone();

        if let Err(errors) = input.validate() {
            error!(
                "FolderQuery Error - Validation failed for FolderQueryInput: {:?}",
                errors
            );
            return Err(async_graphql::Error::new(format!(
                "Validation failed: {:?}",
                errors
            )));
        }

        let (folder_id, entries): (i32, Vec<MinimalEntry>) = {
            let mut conn = pool.get().map_err(|e| {
                error!(
                    "FolderQuery Error - Failed to get DB connection from pool: {}",
                    e
                );
                async_graphql::Error::new("Database connection error")
            })?;

            if let Some(folder_id) = input.folder_id {
                let is_folder_exists = dsl::entries
                    .filter(dsl::id.eq(folder_id))
                    .filter(dsl::is_folder.eq(true))
                    .count()
                    .get_result::<i64>(&mut conn)
                    .map_err(|e| {
                        error!(
                            "FolderQuery Error - Failed to query folder_id {}: {}",
                            folder_id, e
                        );
                        async_graphql::Error::new("Failed to validate folder_id")
                    })?;

                if is_folder_exists == 0 {
                    error!(
                        "FolderQuery Error - Folder with ID {} does not exist",
                        folder_id
                    );
                    return Err(async_graphql::Error::new(format!(
                        "Folder with ID {} not found",
                        folder_id
                    )));
                }

                let entries = dsl::entries
                    .filter(dsl::parent_id.eq(folder_id))
                    .load::<Entry>(&mut conn)
                    .map_err(|e| {
                        error!(
                            "FolderQuery Error - Failed to query entries for folder_id {}: {}",
                            folder_id, e
                        );
                        async_graphql::Error::new("Failed to retrieve entries")
                    })?
                    .into_iter()
                    .map(|entry| MinimalEntry {
                        id: entry.id,
                        title: entry.title,
                        is_folder: entry.is_folder,
                    })
                    .collect();

                (folder_id, entries)
            } else {
                let root_id = dsl::entries
                    .filter(dsl::title.eq(&input.root_title))
                    .filter(dsl::parent_id.is_null())
                    .select(dsl::id)
                    .get_result::<i32>(&mut conn)
                    .map_err(|e| {
                        error!(
                            "FolderQuery Error - Failed to query entries for root_title '{}': {}",
                            input.root_title, e
                        );
                        async_graphql::Error::new("Failed to retrieve entries")
                    })?;

                let entries = dsl::entries
                    .filter(dsl::parent_id.eq(Some(root_id)))
                    .load::<Entry>(&mut conn)
                    .map_err(|e| {
                        error!(
                            "FolderQuery Error - Failed to query entries for root_id {}: {}",
                            root_id, e
                        );
                        async_graphql::Error::new("Failed to retrieve entries")
                    })?
                    .into_iter()
                    .map(|entry| MinimalEntry {
                        id: entry.id,
                        title: entry.title,
                        is_folder: entry.is_folder,
                    })
                    .collect();

                (root_id, entries)
            }
        };

        info!(
            "FolderQuery Successful - fetched {} entries for folder_id {:?}",
            entries.len(),
            folder_id
        );

        Ok(FolderQueryResponse { folder_id, entries })
    }
}
