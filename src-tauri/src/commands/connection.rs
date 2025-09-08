use keyring::Entry;
use specta::specta;
use tauri::{command, AppHandle};
use tauri_plugin_store::StoreExt;

use crate::constants::{SERVICE_NAME, CONNECTIONS_FILE_NAME};

#[specta]
#[command]
pub fn connect_to_db(app: AppHandle, id: String) -> String {
    let store = app.store(&CONNECTIONS_FILE_NAME).unwrap();
    let entry = Entry::new(&SERVICE_NAME, &id).unwrap();

    let _connection = store.get(&id).expect("Can not get connection from store");
    let _password = entry.get_password().expect("Can not get password from keyring");

    id
}
