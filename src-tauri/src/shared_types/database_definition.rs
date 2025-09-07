use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub enum DatabaseType {
    Mysql,
    Postgres,
}

#[derive(Serialize, Deserialize, Type)]
pub struct DatabaseDefinitionBase {
    pub name: String,
    pub is_production: bool,
    pub db_type: DatabaseType,
    pub host: String,
    pub port: u16,
    pub username: String,
    pub database_name: String,
}
