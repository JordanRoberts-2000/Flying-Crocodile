use diesel::{
    pg::PgConnection,
    r2d2::{ConnectionManager, Pool},
};
use std::env;

pub type DbPool = Pool<ConnectionManager<PgConnection>>;

pub fn get_connection_pool() -> Result<DbPool, String> {
    let url = env::var("DATABASE_URL").map_err(|_| "DATABASE_URL not found in .env".to_string())?;

    let manager = ConnectionManager::<PgConnection>::new(url);

    Pool::builder()
        .test_on_check_out(true)
        .build(manager)
        .map_err(|err| format!("Could not build connection pool: {}", err))
}
