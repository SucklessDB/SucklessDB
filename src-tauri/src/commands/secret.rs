use keyring::Entry;
use specta::specta;
use tauri::{command, AppHandle};

#[specta]
#[command]
pub fn save_password(app: AppHandle, id: String, password: String) -> Result<(), String> {
    let identifier = &app.config().identifier;
    let entry = Entry::new(&identifier, &id).map_err(|e| format!("Can not create keyring entry: {}", e))?;
    entry.set_password(&password).map_err(|e| format!("Can not save password to keyring: {}", e))?;

    Ok(())
}

#[specta]
#[command]
pub fn get_password(app: AppHandle, id: String) -> Result<String, String> {
    let identifier = &app.config().identifier;
    let entry = Entry::new(&identifier, &id).map_err(|e| format!("Can not create keyring entry: {}", e))?;
    let password = entry.get_password().map_err(|e| format!("Can not get password: {}", e))?;

    Ok(password)
}
