use keyring::Entry;
use specta::specta;
use tauri::command;

use crate::constants::SERVICE_NAME;

#[specta]
#[command]
pub fn save_password(id: String, password: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, &id).map_err(|e| format!("Can not create keyring entry: {}", e))?;
    entry.set_password(password).map_err(|e| format!("Can not save password to keyring: {}", e))?;

    Ok(())
}

#[specta]
#[command]
pub fn get_password(id: String) -> Result<String, String> {
    let entry = Entry::new(SERVICE_NAME, &id).map_err(|e| format!("Can not create keyring entry: {}", e))?;
    let password = entry.get_password().map_err(|e| format!("Can not save password to keyring: {}", e))?;

    Ok(password)
}
