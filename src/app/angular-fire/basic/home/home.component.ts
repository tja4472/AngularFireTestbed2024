import { Component } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { FirestoreComponent } from '../firestore/firestore.component';

import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-home',
  template: `
    <header>
      <a href="/">Home</a>
      <h1>Basic: AngularFire</h1>
    </header>

    Hello world! firebaseApp.name: {{ firebaseApp.name }}
    <app-auth></app-auth>
    <app-firestore></app-firestore>
  `,
  standalone: true,
  imports: [AuthComponent, FirestoreComponent],
})
export default class HomeComponent {
  // private authFirebase = inject(AUTH_FIREBASE);

  constructor(public readonly firebaseApp: FirebaseApp) {}
}
