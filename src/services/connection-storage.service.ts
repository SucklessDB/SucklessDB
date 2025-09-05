import { Injectable } from "@angular/core";
import { load, Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';
import { DatabaseDefinition } from '@/types/bindings';

@Injectable({ providedIn: 'root' })
export class ConnectionStorageService {
    private store?: Store;

    public async init() {
        this.store = await load('connections.json');
    }

    public async addConnection(connection: DatabaseDefinition) {
        if (!this.store) {
            return;
        }

        await this.store.set(uuid(), connection);
        await this.store.save();
    }

    public async getConnections(): Promise<DatabaseDefinition[]> {
        if (!this.store) {
            return [];
        }

        return await this.store.values();
    }
}
