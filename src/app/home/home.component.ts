import { Component, Inject, Optional } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Response } from 'express';

import { FirestoreComponent } from '../firestore/firestore.component';

import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-home',
  template: `
    Hello world!
    {{ firebaseApp.name }}
    <app-auth></app-auth>
    <app-firestore></app-firestore>

    <a href="/local-storage">Local Storage</a><br />

    <a href="/firestore-using-service">Firestore Using Service</a>
  `,
  standalone: true,
  imports: [AuthComponent, FirestoreComponent],
})
export class HomeComponent {
  constructor(public readonly firebaseApp: FirebaseApp) {}
}
