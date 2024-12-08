use crate::db::DbPool;
use async_graphql::{dataloader::DataLoader, EmptySubscription, Schema};

use super::{loaders::EntryLoader, mutation::RootMutation, query::RootQuery};

pub type AppSchema = Schema<RootQuery, RootMutation, EmptySubscription>;

pub fn create_schema(db_pool: &DbPool) -> AppSchema {
    let entry_loader = DataLoader::new(
        EntryLoader {
            db_pool: db_pool.clone(),
        },
        tokio::spawn,
    );

    Schema::build(
        RootQuery::default(),
        RootMutation::default(),
        EmptySubscription,
    )
    .data(db_pool.clone())
    .data(entry_loader)
    .finish()
}
