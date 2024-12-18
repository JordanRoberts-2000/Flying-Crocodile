use std::time::Duration;

pub const INITIAL_ROOT_FOLDERS: [&str; 3] = ["public", "inspo", "flying crocodile"];
// pub const SESSION_EXPIRY: Duration = Duration::from_secs(60 * 60 * 24 * 7); // 1 week
pub const SESSION_EXPIRY: Duration = Duration::from_secs(3 * 60); // 3 mins
