import { Routes } from '@angular/router';
import { connectionFormGuard } from '../routes/connection-form/connection-form.guard';

export const routes: Routes = [
    {
        loadComponent: () => import('../routes/connection-form/connection-form.component').then(m => m.ConnectionFormComponent),
        path: 'connect',
        title: 'SucklessDB | Connect',
        canActivate: [connectionFormGuard]
    },
    {
        path: '**',
        redirectTo: 'connect',
        pathMatch: 'full',
    },
];
