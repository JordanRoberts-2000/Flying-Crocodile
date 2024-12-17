use actix_web::web;

use crate::handlers::graphql::{graphql_handler, index_graphiql};

pub fn graphql_routes(config: &mut web::ServiceConfig) {
    config
        .route("/graphql", web::get().to(index_graphiql))
        .route("/graphql", web::post().to(graphql_handler));
}
