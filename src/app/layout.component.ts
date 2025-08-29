import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastComponent } from "../ui-utils/toast/toast.component";
import { ToastService } from "../ui-utils/toast/toast.service";

@Component({
    selector: 'app-root',
    templateUrl: 'layout.component.html',
    imports: [RouterOutlet, ToastComponent]
})
export class LayoutComponent implements OnInit {
    private toastService = inject(ToastService);

    public ngOnInit() {
        this.toastService.toast('alert-info', 'Welcome in SucklessDB', 3000);
    }
}
