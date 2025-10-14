import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectionsListComponent } from '@/components/connections-list/connections-list.component';
import { ConnectionStorageService, type DatabaseDefinition } from '@/services/connection-storage.service';

@Component({
    selector: 'app-connections',
    templateUrl: './connections.component.html',
    imports: [ConnectionsListComponent, RouterOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
