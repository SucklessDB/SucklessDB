use tauri_specta::{Builder};

#[cfg(debug_assertions)]
use specta_typescript::Typescript;

mod database_definition;
use database_definition::{
    DatabaseDefinition,
    DatabaseType
};

pub fn export_types() -> Builder<tauri::Wry> {
    let builder = Builder::<tauri::Wry>::new()
        .typ::<DatabaseDefinition>()
        .typ::<DatabaseType>();

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../backend/bindings.ts")
        .expect("Failed to export typescript bindings");

    builder
}
