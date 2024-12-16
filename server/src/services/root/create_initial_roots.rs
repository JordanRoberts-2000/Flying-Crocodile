use log::{debug, error, info};

use crate::{config::constants::INITIAL_ROOT_FOLDERS, state::AppState};

use super::RootService;

impl RootService {
    pub fn create_initial_roots(app_state: &AppState) {
        if let Err(err) = Self::try_initialize(app_state) {
            error!("Failed to initialize root folders: {}", err);
            std::process::exit(1);
        }
    }

    fn try_initialize(app_state: &AppState) -> Result<(), String> {
        for folder in INITIAL_ROOT_FOLDERS {
            match Self::get_root(app_state, folder) {
                Ok(entry) => {
                    app_state.cache.root.add(&entry)?;
                }
                Err(_) => {
                    Self::create_root(app_state, folder)
                        .map_err(|e| format!("Error creating root folder `{}`: {}", folder, e))?;
                    info!("Created root folder `{}`.", folder);
                }
            }
        }

        debug!(
            "Cache state after initialization: {:#?}",
            app_state.cache.root.cache
        );

        Ok(())
    }
}
