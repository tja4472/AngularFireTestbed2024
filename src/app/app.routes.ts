import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    outlet: 'primary',
    pathMatch: 'prefix',
  },
  {
    path: 'joshhome',
    loadComponent: () => import('./josh/app/home/home.component'),
  },
  {
    path: 'checklist/:id',
    loadComponent: () => import('./josh/app/checklist/checklist.component'),
  },
  {
    path: 'foo',
    component: HomeComponent,
    outlet: 'primary',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
];

// https://www.angulararchitects.io/en/blog/routing-and-lazy-loading-with-standalone-components/
/*
    // Option 2: Directly Lazy Loading a Standalone Component
    {
        path: 'next-flight',
        loadComponent: () => 
            import('./next-flight/next-flight.component')
                .then(m => m.NextFlightComponent)
    },
*/
