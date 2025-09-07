import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { ConnectionStorageService, DatabaseDefinition } from "@/services/connection-storage.service";

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
        this.loadConnections();
    }

    constructor() {
        this.loadConnections();
    }

    private async loadConnections() {
        const connections = await this.connectionService.getConnections();
        this.connections.set(connections);
    }
}
