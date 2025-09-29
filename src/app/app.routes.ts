import { ConnectionsComponent } from '@/routes/connections/connections.component';
import { connectionsGuard } from '@/routes/connections/connections.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        component: ConnectionsComponent,
        path: 'connections',
        canActivate: [connectionsGuard],
        canActivateChild: [connectionsGuard],
        children: [
            {
                loadComponent: () => import('@/routes/connection-detail/connection-detail.component').then(m => m.ConnectionDetailComponent),
                path: ':connection'
            }
        ]
    },
    {
        loadComponent: () => import('@/routes/database/database.component').then(m => m.DatabaseComponent),
        path: 'database/:id',
    },
    {
        path: '**',
        redirectTo: 'connections',
        pathMatch: 'full',
    },
];
