import { ConnectionFormComponent } from "@/components/connection-form/connection-form.component";
import { ConnectionStorageService, DatabaseModel } from "@/services/connection-storage.service";
import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { from, map, of, switchMap } from "rxjs";

@Component({
    selector: 'connection-detail',
    templateUrl: './connection-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        :host {
            width: 100%;
        }
    `,
    imports: [ConnectionFormComponent, AsyncPipe]
})
export class ConnectionDetailComponent {
    private connectionService = inject(ConnectionStorageService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    public connection$ = this.activatedRoute.params.pipe(
        map(params => params['connection']),
        switchMap(connectionId => {
            if(connectionId === 'new') {
                return of(undefined);
            } else {
                return from(this.connectionService.getConnectionDetail(connectionId));
            }
        })
    )

    public async saveConnection(connection: DatabaseModel) {
        const connectionId = this.activatedRoute.snapshot.params['connection'];
        if(connectionId === 'new') {
            const created = await this.connectionService.createConnection(connection);
            this.router.navigate(['/connections', created]);
        } else {
            await this.connectionService.updateConnection(connectionId, connection);
        }
    }
}
