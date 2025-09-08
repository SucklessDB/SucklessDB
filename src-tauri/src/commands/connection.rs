use keyring::Entry;
use specta::specta;
use tauri::{command, AppHandle};
use tauri_plugin_store::StoreExt;
use serde_json::from_value;

use crate::{constants::{CONNECTIONS_FILE_NAME, SERVICE_NAME}, shared_types::database_definition::DatabaseDefinitionBase};

#[specta]
#[command]
pub fn connect_to_db(app: AppHandle, id: String) -> Result<DatabaseDefinitionBase, String> {
    let store = app.store(&CONNECTIONS_FILE_NAME)
        .map_err(|e| format!("Failed to access store: {}", e))?;
    
    let entry = Entry::new(&SERVICE_NAME, &id)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;

    let connection_record = store.get(&id)
        .ok_or_else(|| format!("Connection with id '{}' not found", id))?;
    
    let connection: DatabaseDefinitionBase = from_value(connection_record)
        .map_err(|e| format!("Failed to parse connection data: {}", e))?;
    
    let _password = entry.get_password()
        .map_err(|e| format!("Failed to retrieve password from keyring: {}", e))?;

    Ok(connection)
}
