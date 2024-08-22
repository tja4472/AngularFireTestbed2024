import { Route } from '@angular/router';

import HomeComponent from './home/home.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: HomeComponent,
    // outlet: 'primary',
    pathMatch: 'prefix',
  },
  {
    path: 'checklist/:id',
    loadComponent: () => import('./checklist/checklist.component'),
  },
];
