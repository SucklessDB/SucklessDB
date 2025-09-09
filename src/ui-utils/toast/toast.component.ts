import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
    selector: 'sdb-toast',
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css',
    imports: [NgClass],
})
export class ToastComponent {
    public toasts = inject(ToastService).toasts;
}
