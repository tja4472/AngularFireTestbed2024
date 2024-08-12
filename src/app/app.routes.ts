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
    path: 'local-storage',
    loadComponent: () => import('./local-storage/home/home.component'),
  },
  {
    path: 'local-storage/checklist/:id',
    loadComponent: () =>
      import('./local-storage/checklist/checklist.component'),
  },
  {
    path: 'firestore-using-service',
    loadComponent: () =>
      import('./firestore-using-service/home/home.component'),
  },
  {
    path: 'firestore-using-service/checklist/:id',
    loadComponent: () =>
      import('./firestore-using-service/checklist/checklist.component'),
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
