use keyring::Entry;
use specta::specta;
use tauri::command;

use crate::constants::SERVICE_NAME;

#[specta]
#[command]
pub fn connect_to_db(id: String) -> String {
    let _entry = Entry::new(&SERVICE_NAME, &id).unwrap();



    id
}
