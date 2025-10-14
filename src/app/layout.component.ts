import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@/ui-utils/toast/toast.component';

@Component({
    selector: 'app-root',
    templateUrl: 'layout.component.html',
    imports: [RouterOutlet, ToastComponent],
})
export class LayoutComponent {}
