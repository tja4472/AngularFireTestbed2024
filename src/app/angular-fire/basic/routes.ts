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
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
];
