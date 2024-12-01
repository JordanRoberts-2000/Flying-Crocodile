use crate::models::{Entry, RootEntry};
use crate::schema::entries::dsl;
use crate::{db::DbPool, schema::entries};
use actix_web::web;
use async_graphql::{Context, Object, Result};
use diesel::prelude::*;

#[derive(Default)]
pub struct EntryQuery;

#[Object]
impl EntryQuery {
    async fn get_entries(&self, ctx: &Context<'_>, parent_id: Option<i32>) -> Result<Vec<Entry>> {
        let pool = ctx.data::<DbPool>()?.clone();
        let pid_cant_be_null = parent_id.expect("Null needs to be removed from top");
        let entries_result = web::block(move || {
            let mut connection = pool.get().expect("Failed to get DB connection from pool");
            dsl::entries
                .filter(entries::parent_id.eq(pid_cant_be_null))
                .load::<Entry>(&mut connection)
        })
        .await??;
        Ok(entries_result)
    }
}

#[derive(Default)]
pub struct RootEntryQuery;

#[Object]
impl RootEntryQuery {
    async fn get_root_entries(&self, ctx: &Context<'_>, title: String) -> Result<RootEntry> {
        let pool = ctx.data::<DbPool>()?.clone();
        let root_id = web::block({
            let pool = pool.clone();
            move || {
                let mut connection = pool.get().expect("Failed to get DB connection from pool");
                dsl::entries
                    .filter(entries::title.eq(&title))
                    .filter(entries::parent_id.is_null())
                    .select(entries::id)
                    .first::<i32>(&mut connection)
            }
        })
        .await??;

        let entries_result = web::block({
            let pool = pool.clone();
            move || {
                let mut connection = pool.get().expect("Failed to get DB connection from pool");
                dsl::entries
                    .filter(entries::parent_id.eq(root_id))
                    .load::<Entry>(&mut connection)
            }
        })
        .await??;

        Ok(RootEntry {
            root_id,
            entries: entries_result,
        })
    }
}
