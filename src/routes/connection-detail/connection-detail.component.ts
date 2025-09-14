import { CreateConnectionComponent } from "@/components/create-connection/create-connection.component";
import { ConnectionStorageService } from "@/services/connection-storage.service";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'connection-detail',
    templateUrl: './connection-detail.component.html',
    imports: []
})
export class ConnectionDetailComponent implements OnInit {
    private connectionService = inject(ConnectionStorageService);
    private activatedRoute = inject(ActivatedRoute);

    public get connectionId(): string {
        return this.activatedRoute.snapshot.params['id'];
    }

    public ngOnInit() {
        this.connectionService.getConnectionDetail(this.connectionId);
    }
}
