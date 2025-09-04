import { Component, inject, signal } from "@angular/core";
import { ConnectionDefinition, ConnectionStorageService } from "../../services/connection-storage.service";

@Component({
    selector: 'connection-form',
    templateUrl: './connection-form.component.html',
    styleUrl: './connection-form.component.css',
})
export class ConnectionFormComponent {
    private connectionService = inject(ConnectionStorageService);

    public connections = signal<ConnectionDefinition[]>([]);

    public async add() {
        await this.connectionService.addConnection({
            name: 'test',
            isProduction: false,
        });

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
