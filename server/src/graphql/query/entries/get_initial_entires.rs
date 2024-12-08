use std::collections::HashMap;

use crate::graphql::loaders::EntryLoader;
use crate::models::{Entry, InitialEntriesResponse};
use crate::schema::entries::dsl;
use crate::{db::DbPool, schema::entries};
use actix_web::web;
use async_graphql::dataloader::DataLoader;
use async_graphql::{Context, Object, Result};
use diesel::prelude::*;
use log::info;

// change to get root entries
// recieve string
// check if string is a existing root
// fetch the roots children
// return data like {id: [{id: 3, title: "example", isFolder: true}, ...]}

#[derive(Default)]
pub struct InitialEntriesQuery;

#[Object]
impl InitialEntriesQuery {
    async fn get_initial_entries(
        &self,
        ctx: &Context<'_>,
        title: String,
    ) -> Result<InitialEntriesResponse> {
        info!("GraphQL Query hit: get_entries with title: {}", title);

        // Step 1: Lookup parent_id based on the title
        let pool = ctx.data::<DbPool>()?.clone();
        let root_id = web::block({
            let pool = pool.clone();
            move || {
                let mut connection = pool.get().expect("Failed to get DB connection from pool");
                dsl::entries
                    .filter(dsl::title.eq(&title))
                    .filter(dsl::parent_id.is_null()) // Ensure it's a root entry
                    .select(dsl::id)
                    .first::<i32>(&mut connection)
            }
        })
        .await?
        .map_err(|e| {
            // async_graphql::Error::new(format!(
            //     "Failed to find parent_id for title '{}': {}",
            //     title, e
            // ))
            async_graphql::Error::new(format!("Failed to find parent_id for title"))
        })?;

        // Step 2: Use DataLoader to fetch child entries
        let loader = ctx.data::<DataLoader<EntryLoader>>()?;
        let entries_result = loader.load_one(root_id).await.map_err(|e| {
            async_graphql::Error::new(format!(
                "Failed to load entries for parent_id {}: {}",
                root_id, e
            ))
        })?;

        let mut initial_entries = HashMap::new();

        if let Some(entries) = entries_result {
            for entry in entries {
                initial_entries.insert(entry.id, entry);
            }

            info!(
                "Successfully fetched {} child entries for root_id: {}",
                initial_entries.len(),
                root_id
            );
        }

        println!("{:?}", initial_entries);

        // info!(
        //     "Successfully fetched {} entries for root title '{}'",
        //     entries.len(),
        //     title
        // );

        // Step 3: Return the RootEntry object
        Ok(InitialEntriesResponse {
            root_id,
            initial_entries,
        })
    }
}
