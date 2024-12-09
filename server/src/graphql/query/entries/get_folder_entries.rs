use crate::models::{FolderQueryInput, FolderQueryResponse};
use crate::AppState;
use async_graphql::{Context, Object, Result};
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

        if let Err(errors) = input.validate() {
            error!(
                "FolderQuery Error - Validation failed for FolderQueryInput: {:?}",
                errors
            );
            return Err(async_graphql::Error::new("Validation error"));
        }

        let (folder_id, entries) = match app_state
            .folder_manager
            .get_entries(input.folder_id, &input.root_title)
        {
            Ok(result) => result,
            Err(e) => {
                error!("FolderQuery Error - {}", e);
                return Err(async_graphql::Error::new("Internal server error"));
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
