import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';

import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import {
  browserPopupRedirectResolver,
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  provideAuth,
} from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  provideFirestore,
} from '@angular/fire/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfigEmulatorDemo: FirebaseConfig = {
  apiKey: 'demo-project-key',
  authDomain: '',
  databaseURL: '',
  projectId: 'demo-project',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(DialogModule),
    provideFirebaseApp(() => initializeApp(firebaseConfigEmulatorDemo)),
    provideAuth(() => {
      // const auth = getAuth();
      const auth = initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      });

      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: false,
      });

      return auth;
    }),
    provideFirestore(() => {
      let firestore;

      // bug: experimentalAutoDetectLongPolling not picked up via `getFirestore`
      const app = getApp();
      firestore = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        // localCache: persistentLocalCache(),
      });
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      /*        
      } else {
        firestore = getFirestore();
        enableIndexedDbPersistence(firestore);
      }
*/

      return firestore;
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
