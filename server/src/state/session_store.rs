use log::debug;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::SystemTime;

use crate::models::auth::github::GitHubUser;
use crate::models::auth::session::SessionData;

pub struct SessionStore {
    pub sessions: Arc<Mutex<HashMap<String, SessionData>>>,
}

impl SessionStore {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn get_session(&self, session_id: &str) -> Result<Option<SessionData>, String> {
        let lock = self
            .sessions
            .lock()
            .map_err(|e| format!("Failed to acquire session lock: {}", e))?;

        let session = lock.get(session_id).cloned();

        if let Some(ref _session_data) = session {
            debug!("Session found for session_id: {}", session_id);
        } else {
            debug!("No session found for session_id: {}", session_id);
        }

        Ok(session)
    }

    pub fn add_session(&self, session_id: &String, user: GitHubUser) -> Result<(), String> {
        let session = SessionData {
            user,
            created_at: SystemTime::now(),
        };

        let mut lock = self
            .sessions
            .lock()
            .map_err(|e| format!("Failed to acquire session lock: {}", e))?;

        lock.insert(session_id.clone(), session);

        debug!("Session added for session_id: {}", session_id);

        Ok(())
    }

    pub fn remove_session(&self, session_id: &str) -> Result<(), String> {
        let mut sessions = self
            .sessions
            .lock()
            .map_err(|e| format!("Failed to acquire session lock: {}", e))?;

        if sessions.remove(session_id).is_some() {
            debug!("Session removed for session_id: {}", session_id);
            Ok(())
        } else {
            Err(format!("No session found for session_id: {}", session_id))
        }
    }
}
