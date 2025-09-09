import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastComponent } from "@/ui-utils/toast/toast.component";
import { ConnectionsMenuComponent } from "@/components/connections-menu/connections-menu.component";
import { ConnectionStorageService } from "@/services/connection-storage.service";

@Component({
    selector: 'app-root',
    templateUrl: 'layout.component.html',
    imports: [RouterOutlet, ToastComponent, ConnectionsMenuComponent],
})
export class LayoutComponent implements OnInit {
    private connectionsService = inject(ConnectionStorageService);

    private _initialized = signal(false);
    public readonly initialized = this._initialized.asReadonly();

    public async ngOnInit() {
        await this.connectionsService.init();
        this._initialized.set(true);
    }

}
