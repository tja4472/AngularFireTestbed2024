import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    outlet: 'primary',
    pathMatch: 'prefix',
  },
  // >>> local-storage <<<
  {
    path: 'local-storage/signals',
    loadChildren: () =>
      import('./local-storage/signals/routes').then((m) => m.ROUTES),
  },

  {
    path: 'local-storage/signal-store',
    loadChildren: () =>
      import('./local-storage/signal-store/routes').then((m) => m.ROUTES),
  },
  // >>> angular-fire <<<
  {
    path: 'angular-fire/basic',
    loadChildren: () =>
      import('./angular-fire/basic/routes').then((m) => m.ROUTES),
  },
  {
    path: 'angular-fire/signals',
    loadChildren: () =>
      import('./angular-fire/signals/routes').then((m) => m.ROUTES),
  },
  // >>>  <<<
  {
    path: 'foo',
    component: HomeComponent,
    outlet: 'primary',
    pathMatch: 'full',
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
