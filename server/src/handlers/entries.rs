use crate::db::DbPool;
use crate::models::{Entry, NewEntry};
use crate::schema::entries::dsl::*;
use actix_web::{get, post, web, HttpResponse, Responder};
use diesel::prelude::*;

#[get("/entries")]
pub async fn get_entries(pool: web::Data<DbPool>) -> impl Responder {
    println!("Get request triggered");
    let result = web::block(move || {
        let mut connection = pool.get().expect("Failed to get DB connection from pool");
        entries.load::<Entry>(&mut connection)
    })
    .await;
    // TODO: FIX UNWRAP ISSUE, DOUBLE RESULT
    match result {
        Ok(results) => HttpResponse::Ok().json(results.unwrap()),
        Err(_) => HttpResponse::InternalServerError().json("Error loading entries"),
    }
}

#[post("/entries")]
pub async fn create_entry(pool: web::Data<DbPool>, entry: web::Json<NewEntry>) -> impl Responder {
    let new_entry = entry.into_inner();

    // Use a web::block to offload the database operation to a thread pool
    let result = web::block(move || {
        let mut conn = pool.get().expect("Failed to get DB connection from pool");

        diesel::insert_into(entries)
            .values(&new_entry)
            .execute(&mut conn)
    })
    .await;

    match result {
        Ok(_) => HttpResponse::Created().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
