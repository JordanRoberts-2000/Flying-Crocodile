use crate::handlers::entries::{create_entry, get_entries};
use actix_web::web;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_entries);
    cfg.service(create_entry);
}
