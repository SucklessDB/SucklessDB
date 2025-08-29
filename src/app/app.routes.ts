import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        loadComponent: () => import('../routes/connection-form/connection-form.component').then(m => m.ConnectionFormComponent),
        path: 'connect',
        title: 'SucklessDB | Connect'
    },
    {
        path: '**',
        redirectTo: 'connect',
        pathMatch: 'full',
    },
];
