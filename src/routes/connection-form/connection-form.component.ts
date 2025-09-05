import { Component, inject, signal } from "@angular/core";
import { ConnectionStorageService } from "@/services/connection-storage.service";
import { DatabaseDefinition } from "@/types/bindings";

@Component({
    selector: 'connection-form',
    templateUrl: './connection-form.component.html',
    styleUrl: './connection-form.component.css',
})
export class ConnectionFormComponent {
    private connectionService = inject(ConnectionStorageService);

    public connections = signal<DatabaseDefinition[]>([]);

    public async add() {
        // await this.connectionService.addConnection({
        //     name: 'test',
        //     is_production: false,
        // });

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
