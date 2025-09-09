import { connectionsGuard } from '@/routes/connections/connections.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        loadComponent: () => import('@/routes/connections/connections.component').then(m => m.ConnectionsComponent),
        path: 'connections',
        title: 'SucklessDB | Connect',
        canActivate: [connectionsGuard]
    },
    {
        path: '**',
        redirectTo: 'connections',
        pathMatch: 'full',
    },
];
