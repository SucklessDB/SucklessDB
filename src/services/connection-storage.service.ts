import { Injectable } from "@angular/core";
import { load, Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';

export interface ConnectionDefinition {
    name: string;
    isProduction: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConnectionStorageService {
    private store?: Store;

    public async init() {
        this.store = await load('connections.json');
    }

    public async addConnection(connection: ConnectionDefinition) {
        if (!this.store) {
            return;
        }

        await this.store.set(uuid(), connection);
        await this.store.save();
    }

    public async getConnections(): Promise<ConnectionDefinition[]> {
        if (!this.store) {
            return [];
        }

        return await this.store.values();
    }
}
