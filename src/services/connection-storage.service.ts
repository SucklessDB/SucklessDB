import { Injectable } from "@angular/core";
import { load, Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';
import { DatabaseDefinition, commands } from '@/backend/bindings';

export const CONNECTIONS_STORAGE = 'connections.json';

@Injectable({ providedIn: 'root' })
export class ConnectionStorageService {
    private store?: Store;

    public async init() {
        this.store = await load(CONNECTIONS_STORAGE, { autoSave: false, defaults: {} });
    }

    public async addConnection() {
        if (!this.store) {
            return;
        }

        const connectionId = uuid();

        const connection: DatabaseDefinition = {
            db_type: 'Postgres',
            database_name: 'my_database',
            host: 'localhost',
            port: 5432,
            username: 'user',
            name: 'My Postgres DB',
            is_production: false,
        }

        await Promise.all([
            commands.savePassword(connectionId, 'super-secret-password'),
            this.store.set(uuid(), connection)
        ]);

        await this.store.save();
    }

    public async getConnections() {
        if (!this.store) {
            return [];
        }

        return await this.store.values<DatabaseDefinition>();
    }

    public async getPassword(id: string) {
        return await commands.getPassword(id);
    }
}
