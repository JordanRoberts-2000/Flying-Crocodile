use crate::db::Db;
use crate::models::Entry;
use crate::schema::entries::dsl::entries; // Explicitly import the entries table
use actix_web::web;
use async_graphql::{Context, Object, Result};
use diesel::prelude::*;

#[derive(Default)]
pub struct EntryQuery;

#[Object]
impl EntryQuery {
    async fn get_entries(&self, ctx: &Context<'_>) -> Result<Vec<Entry>> {
        let pool = ctx.data::<Db>()?.clone();
        let entries_result = web::block(move || {
            let mut connection = pool.get().expect("Failed to get DB connection from pool");
            entries.load::<Entry>(&mut connection)
        })
        .await??;
        Ok(entries_result)
    }
}
