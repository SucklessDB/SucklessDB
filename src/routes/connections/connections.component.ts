import { ConnectionsListComponent } from '@/components/connections-list/connections-list.component';
import { ConnectionStorageService, DatabaseConnectionCreate, DatabaseDefinition } from '@/services/connection-storage.service';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  imports: [ConnectionsListComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsComponent implements OnInit {
    private connectionsService = inject(ConnectionStorageService);

    public selectedConnection = signal<DatabaseDefinition | undefined>(undefined);

    private _connections = signal<DatabaseDefinition[]>([]);
    public connections = this._connections.asReadonly();

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
