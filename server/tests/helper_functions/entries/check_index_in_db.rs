use diesel::prelude::*;
use diesel::sql_types::Nullable;
use diesel::sql_types::Text;

#[derive(QueryableByName)]
struct IndexCheckResult {
    #[diesel(sql_type = Nullable<Text>)]
    to_regclass: Option<String>,
}

pub fn check_index_in_db(connection: &mut PgConnection, index_name: &str) -> Result<(), String> {
    let query = format!("SELECT to_regclass('{}')::text AS to_regclass", index_name);

    let result = diesel::sql_query(query)
        .load::<IndexCheckResult>(connection)
        .map_err(|e| format!("Failed to check index `{}`: {}", index_name, e))?;

    if let Some(row) = result.first() {
        if row.to_regclass.is_some() {
            return Ok(());
        }
    }

    Err(format!(
        "Index `{}` does not exist in the database",
        index_name
    ))
}
