import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Local Storage</h2>

    <a href="/local-storage/signals">Using Signals</a><br />
    <a href="/local-storage/signal-store">Using Signal Store</a><br />

    <h2>AngularFire</h2>
    <a href="/angular-fire/basic">Basic</a><br />
    <a href="/angular-fire/signals">Using Signals</a><br />
    Using Signal Store

    <h2>Firebase</h2>
    Basic<br />
    Using Signals<br />
    Using Signal Store
  `,
  standalone: true,
})
export class HomeComponent {}
