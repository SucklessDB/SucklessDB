import { Injectable } from "@angular/core";
import { load, Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';
import { CONNECTION_FILE_NAME, DatabaseDefinitionBase, commands } from '@tauri-bindings';

export interface DatabaseConnectionCreate extends DatabaseDefinitionBase {
    password: string;
}

export interface DatabaseDefinition extends DatabaseDefinitionBase {
    id: string;
}

@Injectable({ providedIn: 'root' })
export class ConnectionStorageService {
    private store?: Store;

    public async init() {
        this.store = await load(CONNECTION_FILE_NAME, { autoSave: false, defaults: {} });
    }

    public async addConnection(connection: DatabaseConnectionCreate) {
        if (!this.store) {
            return;
        }

        const connectionId = uuid();

        await Promise.all([
            commands.savePassword(connectionId, connection.password),
            this.store.set(uuid(), { ...connection, password: undefined })
        ]);

        await this.store.save();
    }

    public async getConnections(): Promise<DatabaseDefinition[]> {
        if (!this.store) {
            return [];
        }

        const entries = await this.store.entries<DatabaseDefinitionBase>();

        return entries.map(([key, value]) => ({ id: key, ...value}))
    }
}
