use actix_web::{web, HttpResponse, Responder};
use diesel::{dsl::sql_query, RunQueryDsl};
use log::info;
use std::sync::Arc;

use crate::AppState;

pub async fn health_check(state: web::Data<Arc<AppState>>) -> impl Responder {
    info!("Health check endpoint hit.");

    let environment = &state.environment;
    let db_status = match state.db_pool.get() {
        Ok(mut conn) => match sql_query("SELECT 1").execute(&mut conn) {
            Ok(_) => "connected",
            Err(_) => "disconnected",
        },
        Err(_) => "disconnected",
    };

    let uptime = state.start_time.elapsed().as_secs();

    HttpResponse::Ok().json({
        serde_json::json!({
            "status": "ok",
            "environment": environment,
            "database": db_status,
            "uptime": uptime,
        })
    })
}
