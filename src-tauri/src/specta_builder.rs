use tauri_specta::{Builder};

#[cfg(debug_assertions)]
use specta_typescript::Typescript;

use crate::shared_types::database_definition::{
    DatabaseDefinitionBase,
    DatabaseType
};

use crate::commands::{
    secret,
    connection
};

use crate::constants::CONNECTIONS_FILE_NAME;

pub fn get_builder() -> Builder<tauri::Wry> {
    let builder = Builder::<tauri::Wry>::new()
        .typ::<DatabaseDefinitionBase>()
        .typ::<DatabaseType>()
        .constant("CONNECTION_FILE_NAME", &CONNECTIONS_FILE_NAME)
        .commands(tauri_specta::collect_commands![
            secret::save_password,
            connection::connect_to_db
        ]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../tauri-bindings/bindings.ts")
        .expect("Failed to export typescript bindings");

    builder
}
