use async_graphql::futures_util::FutureExt;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use my_project::db::get_connection_pool;
use std::future::Future;
use std::panic;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

pub async fn db_reset<T, Fut>(test_fn: T)
where
    T: FnOnce() -> Fut + panic::UnwindSafe,
    Fut: Future<Output = ()> + Send,
{
    let test_result = panic::AssertUnwindSafe(test_fn()).catch_unwind().await;

    if let Err(e) = reset_database() {
        eprintln!("Failed to reset database: {:?}", e);
    }

    if let Err(e) = test_result {
        panic!("Test failed: {:?}", e);
    }
}

fn reset_database() -> Result<(), Box<dyn std::error::Error>> {
    let pool = get_connection_pool().expect("Failed to create connection pool");
    let mut conn = pool.get().expect("Failed to get connection from pool");

    println!("Reverting migrations...");
    conn.revert_all_migrations(MIGRATIONS)
        .map_err(|e| format!("Failed to revert migrations: {}", e))?;

    println!("Applying migrations...");
    conn.run_pending_migrations(MIGRATIONS)
        .map_err(|e| format!("Failed to run migrations: {}", e))?;

    println!("Database reset successful.");
    Ok(())
}
