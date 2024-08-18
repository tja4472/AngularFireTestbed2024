import { InjectionToken, inject } from '@angular/core';
import { getApp, initializeApp } from 'firebase/app';

import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
  Firestore,
  initializeFirestore,
  connectFirestoreEmulator,
  getFirestore,
  persistentLocalCache,
} from 'firebase/firestore';

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

const appName = 'Firebase';

console.log('>> initializeApp <<');
// TODO: Need to check only called once.
const app = initializeApp(firebaseConfigEmulatorDemo, appName);

export const AUTH_FIREBASE = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth(app);

    connectAuthEmulator(auth, 'http://localhost:9099', {
      disableWarnings: true,
    });

    return auth;
  },
});

export const FIRESTORE_FIREBASE = new InjectionToken('Firebase firestore', {
  providedIn: 'root',
  factory: () => {
    let firestore: Firestore;

    const app = getApp(appName);

    firestore = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
    connectFirestoreEmulator(firestore, 'localhost', 8080);

    return firestore;
  },
});
