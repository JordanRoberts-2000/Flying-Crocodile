use std::time::SystemTime;

use super::github::GitHubUser;

#[derive(Clone, Debug)]
pub struct SessionData {
    pub user: GitHubUser,
    pub created_at: SystemTime,
}
