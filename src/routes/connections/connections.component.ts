import { ConnectionsListComponent } from '@/components/connections-list/connections-list.component';
import { ConnectionStorageService, DatabaseDefinition } from '@/services/connection-storage.service';
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

    constructor() {
        this.connectionsService.reloadConnections$.subscribe(() => this.loadConnections());
    }

    public ngOnInit() {
        this.loadConnections();
    }

    private async loadConnections() {
        this._connections.set(await this.connectionsService.getConnections());
    }
}
