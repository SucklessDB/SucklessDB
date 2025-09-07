use keyring::Entry;
use specta::specta;
use tauri::command;

use crate::constants::SERVICE_NAME;

#[specta]
#[command]
pub fn save_password(id: String, password: String) -> String {
    let entry = Entry::new(&SERVICE_NAME, &id).unwrap();
    entry.set_password(&password).unwrap();
    return id;
}

#[specta]
#[command]
pub fn get_password(id: String) -> String {
    let entry = Entry::new(&SERVICE_NAME, &id).unwrap();
    let password = entry.get_password().unwrap();

    password
}
