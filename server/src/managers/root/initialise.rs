use log::{debug, info};

use super::RootManager;

impl RootManager {
    pub fn initialize(&mut self) -> Result<(), String> {
        let root_folders = ["public", "inspo", "flying crocodile"];

        for folder in &root_folders {
            match self.get_root(folder) {
                Ok(entry) => {
                    self.add_to_cache(&entry)?;
                }
                Err(_) => {
                    self.create_root(folder)
                        .map_err(|e| format!("Error creating root folder `{}`: {}", folder, e))?;
                    info!("Created root folder `{}`.", folder);
                }
            }
        }

        debug!("Cache state after initialization: {:#?}", self.cache);

        Ok(())
    }
}
