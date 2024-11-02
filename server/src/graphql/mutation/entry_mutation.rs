use crate::db::Db;
use crate::models::{Entry, NewEntry};
use crate::schema::entries::dsl::*;
use actix_web::web;
use async_graphql::{Context, Object, Result};
use diesel::prelude::*;

#[derive(Default)]
pub struct EntryMutation;

#[Object]
impl EntryMutation {
    async fn create_entry(&self, ctx: &Context<'_>, new_entry: NewEntry) -> Result<Entry> {
        let pool = ctx.data::<Db>()?.clone();

        let entry = web::block(move || {
            let mut conn = pool.get().expect("Failed to get DB connection from pool");
            diesel::insert_into(entries)
                .values(&new_entry)
                .get_result(&mut conn)
        })
        .await??;

        Ok(entry)
    }

    async fn delete_entry(&self, ctx: &Context<'_>, entry_id: i32) -> Result<Entry> {
        let pool = ctx.data::<Db>()?.clone();

        let deleted_entry = web::block(move || {
            let mut conn = pool.get().expect("Failed to get DB connection from pool");
            diesel::delete(entries.filter(id.eq(entry_id))).get_result(&mut conn)
        })
        .await??;

        Ok(deleted_entry)
    }
}
