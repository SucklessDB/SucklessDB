use tauri_specta::{Builder};

#[cfg(debug_assertions)]
use specta_typescript::Typescript;

use crate::shared_types::database_definition::{
    DatabaseDefinition,
    DatabaseType
};

use crate::commands::{
    secrets
};

pub fn get_builder() -> Builder<tauri::Wry> {
    let builder = Builder::<tauri::Wry>::new()
        .typ::<DatabaseDefinition>()
        .typ::<DatabaseType>()
        .commands(tauri_specta::collect_commands![
            secrets::save_password,
            secrets::get_password
        ]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../backend/bindings.ts")
        .expect("Failed to export typescript bindings");

    builder
}
