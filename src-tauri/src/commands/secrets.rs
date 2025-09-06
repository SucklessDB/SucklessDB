use keyring::Entry;
use specta::specta;
use tauri::command;

#[specta]
#[command]
pub fn save_password(id: String, password: String) -> String {
    let entry = Entry::new("sucklessdb", &id).unwrap();
    entry.set_password(&password).unwrap();
    return id;
}

#[specta]
#[command]
pub fn get_password(id: String) -> String {
    let entry = Entry::new("sucklessdb", &id).unwrap();
    let password = entry.get_password().unwrap();

    password
}
