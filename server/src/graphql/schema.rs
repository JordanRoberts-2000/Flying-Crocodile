use crate::db::Db;
use async_graphql::{EmptySubscription, Schema};

use super::{mutation::RootMutation, query::RootQuery};

pub type AppSchema = Schema<RootQuery, RootMutation, EmptySubscription>;

pub fn create_schema(db_pool: Db) -> AppSchema {
    Schema::build(
        RootQuery::default(),
        RootMutation::default(),
        EmptySubscription,
    )
    .data(db_pool)
    .finish()
}
