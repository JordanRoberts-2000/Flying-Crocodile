// @generated automatically by Diesel CLI.

diesel::table! {
    entries (id) {
        id -> Int4,
        title -> Varchar,
        parent_id -> Nullable<Int4>,
        is_folder -> Bool,
    }
}
