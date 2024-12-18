use std::sync::Arc;

use actix_web::{web, HttpResponse, Responder};
use diesel::{dsl::sql_query, RunQueryDsl};
use log::info;

use crate::AppState;

pub async fn health_check(app_state: web::Data<Arc<AppState>>) -> impl Responder {
    info!("Health check hit");

    let environment = &app_state.config.environment;
    let db_status = match app_state.get_connection() {
        Ok(mut conn) => match sql_query("SELECT 1").execute(&mut conn) {
            Ok(_) => "connected",
            Err(_) => "disconnected",
        },
        Err(_) => "disconnected",
    };

    let uptime = app_state.config.start_time.elapsed().as_secs();

    HttpResponse::Ok().json({
        serde_json::json!({
            "status": "ok",
            "environment": environment,
            "database": db_status,
            "uptime": uptime,
        })
    })
}
