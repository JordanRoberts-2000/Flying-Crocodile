use actix_web::{web, HttpResponse, Responder};
use diesel::{dsl::sql_query, RunQueryDsl};
use std::{env, time::Instant};

use crate::db::DbPool;

pub async fn health_check(
    db_pool: web::Data<DbPool>,
    start_time: web::Data<Instant>,
) -> impl Responder {
    let environment = env::var("ENVIRONMENT").expect("ENVIRONMENT not found in .env");
    let db_status = match db_pool.get() {
        Ok(mut conn) => match sql_query("SELECT 1").execute(&mut conn) {
            Ok(_) => "connected",
            Err(_) => "disconnected",
        },
        Err(_) => "disconnected",
    };

    HttpResponse::Ok().json({
        serde_json::json!({
            "status": "ok",
            "environment": environment,
            "database": db_status,
            "uptime": start_time.elapsed().as_secs(),
        })
    })
}
