import { Component, inject, Optional } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <h2>Local Storage</h2>

    <a href="/local-storage">Using Signals</a><br />
    Using Signal Store

    <h2>AngularFire</h2>
    Basic<br />
    <a href="/firestore-using-service">Using Signals</a><br />
    Using Signal Store

    <h2>Firebase</h2>
    Basic<br />
    Using Signals<br />
    Using Signal Store
  `,
  standalone: true,
})
export class HomeComponent {}
