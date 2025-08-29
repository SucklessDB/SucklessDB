import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
    selector: 'sdb-toast',
    templateUrl: './toast.component.html',
    imports: [NgClass],
})
export class ToastComponent {
    public toasts = inject(ToastService).toasts;
}
