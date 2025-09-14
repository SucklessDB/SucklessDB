import { inject, Injectable } from "@angular/core";
import { load, Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';
import { CONNECTION_FILE_NAME, DatabaseDefinitionBase, DatabaseType, commands } from '@tauri-bindings';
import { ToastService } from "@/ui-utils/toast/toast.service";

export interface DatabaseConnectionCreate extends DatabaseDefinitionBase {
    password: string;
}

export interface DatabaseDefinition extends DatabaseDefinitionBase {
    id: string;
}

export type DatabaseConnectionDetail = DatabaseConnectionCreate & DatabaseDefinition;

export const DatabaseTypes: { readonly [K in DatabaseType]: DatabaseType} = {
    MySQL: 'MySQL',
    PostgreSQL: 'PostgreSQL',
}

@Injectable({ providedIn: 'root' })
export class ConnectionStorageService {
    private toastService = inject(ToastService);
    private store?: Store;

    public async init() {
        if(!this.store) {
            this.store = await load(CONNECTION_FILE_NAME, { autoSave: false, defaults: {} });
        }
    }

    public async addConnection(connection: DatabaseConnectionCreate): Promise<DatabaseDefinition | undefined> {
        if (!this.store) {
            return;
        }

        const connectionId = uuid();

        try {
            const connectionWithoutPassword = (({password, ...connection}) => connection)(connection);

            await Promise.all([
                commands.savePassword(connectionId, connection.password),
                this.store.set(uuid(), connectionWithoutPassword)
            ]);

            await this.store.save();
            return { id: connectionId, ...connectionWithoutPassword };
        } catch {
            this.toastService.toast('alert-error', 'Error while creating connection.');
            return undefined;
        }
    }

    public async getConnections(): Promise<DatabaseDefinition[]> {
        if (!this.store) {
            return [];
        }

        const entries = await this.store.entries<DatabaseDefinitionBase>();

        return entries.map(([key, value]) => ({ id: key, ...value}))
    }

    public async getConnectionDetail(id: string): Promise<DatabaseConnectionDetail | undefined> {
        if(!this.store) {
            return;
        }

        const [connection, password] = await Promise.all([
            this.store.get<DatabaseDefinitionBase>(id),
            commands.getPassword(id)
        ]);

        if(password.status === 'ok' && connection) {
            return { ...connection, password: password.data, id };
        }

        return;
    }
}
