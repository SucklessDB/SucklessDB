import { ConnectionStorageService, DatabaseConnectionCreate, DatabaseDefinition } from "@/services/connection-storage.service";
import { Component, inject, OnInit, signal } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { tablerDatabase } from "@ng-icons/tabler-icons";

@Component({
    selector: 'connections-menu',
    templateUrl: './connections-menu.component.html',
    imports: [NgIcon],
    providers: [provideIcons({ tablerDatabase })]
})
export class ConnectionsMenuComponent implements OnInit {
    private connectionsService = inject(ConnectionStorageService);

    private _connections = signal<DatabaseDefinition[]>([]);
    public readonly connections = this._connections.asReadonly();

    public ngOnInit() {
        this.loadConnections();
    }

    public async createConnection(connectionData: DatabaseConnectionCreate) {
        const connection = await this.connectionsService.addConnection(connectionData);

        if(connection) {
            this._connections.update(c => [...c, connection]);
        }
    }

    private async loadConnections() {
        this._connections.set(await this.connectionsService.getConnections());
    }
}
