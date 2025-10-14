import { ToastService } from '@/ui-utils/toast/toast.service';
import { inject, Injectable } from '@angular/core';
import { load, Store } from '@tauri-apps/plugin-store';
import {
    commands,
    CONNECTION_FILE_NAME,
    DatabaseDefinitionBase,
    DatabaseType,
} from '@tauri-bindings';
import { Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

export interface DatabaseModel extends DatabaseDefinitionBase {
    password: string;
}

export interface DatabaseDefinition extends DatabaseDefinitionBase {
    id: string;
}

export type DatabaseConnectionDetail = DatabaseModel & DatabaseDefinition;

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export const DatabaseTypes: { readonly [K in DatabaseType]: DatabaseType } = {
    MySQL: 'MySQL',
    PostgreSQL: 'PostgreSQL',
};

@Injectable({ providedIn: 'root' })
export class ConnectionStorageService {
    private toastService = inject(ToastService);
    private store?: Store;

    public reloadConnections$ = new Subject<void>();

    public async init() {
        if (!this.store) {
            this.store = await load(CONNECTION_FILE_NAME, {
                autoSave: false,
                defaults: {},
            });
        }
    }

    public async updateConnection(
        connectionId: string,
        connection: DatabaseModel,
    ): Promise<string | undefined> {
        if (!this.store || !this.store.has(connectionId)) {
            return;
        }

        if (await this.saveConnection(connectionId, connection)) {
            this.toastService.toast(
                'alert-success',
                'Connection updated successfully',
            );
            return connectionId;
        }

        return;
    }

    public async createConnection(
        connection: DatabaseModel,
    ): Promise<string | undefined> {
        if (!this.store) {
            return;
        }

        const connectionId = uuid();

        if (await this.saveConnection(connectionId, connection)) {
            this.toastService.toast(
                'alert-success',
                'Connection created successfully',
            );
            return connectionId;
        }

        return;
    }

    public async getConnections(): Promise<DatabaseDefinition[]> {
        if (!this.store) {
            return [];
        }

        const entries = await this.store.entries<DatabaseDefinitionBase>();

        return entries.map(([key, value]) => ({ id: key, ...value }));
    }

    public async getConnectionDetail(
        id: string,
    ): Promise<DatabaseModel | undefined> {
        if (!this.store) {
            return;
        }

        const [connection, password] = await Promise.all([
            this.store.get<DatabaseDefinitionBase>(id),
            commands.getPassword(id),
        ]);

        if (password.status === 'ok' && connection) {
            return { ...connection, password: password.data };
        }

        if (password.status === 'error') {
            this.toastService.toast('alert-error', password.error);
        }

        return;
    }

    private async saveConnection(
        connectionId: string,
        connection: DatabaseModel,
    ): Promise<boolean> {
        if (!this.store) {
            return false;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const connectionWithoutPassword = (({ password, ...connection }) =>
                connection)(connection);

            await Promise.all([
                commands.savePassword(connectionId, connection.password),
                this.store.set(connectionId, connectionWithoutPassword),
            ]);

            await this.store.save();
            this.reloadConnections$.next();
            return true;
        } catch (err) {
            const e = err as Error;
            this.toastService.toast(
                'alert-error',
                `Error while saving connection: ${e.message}`,
            );
            return false;
        }
    }
}
