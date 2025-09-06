import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core";
import { ConnectionStorageService } from "@/services/connection-storage.service";
import { DatabaseDefinition } from "@/backend/bindings";

@Component({
    selector: 'connection-form',
    templateUrl: './connection-form.component.html',
    styleUrl: './connection-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionFormComponent {
    private connectionService = inject(ConnectionStorageService);

    public connections = signal<DatabaseDefinition[]>([]);

    public async add() {
        await this.connectionService.addConnection();

        this.loadConnections();
    }

    constructor() {
        this.loadConnections();
    }

    private async loadConnections() {
        const connections = await this.connectionService.getConnections();
        this.connections.set(connections);
    }

    public async getPassword(id: string) {
        return await this.connectionService.getPassword(id);
    }
}
