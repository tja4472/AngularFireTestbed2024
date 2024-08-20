import { Component, OnInit, OnDestroy, Optional, inject } from '@angular/core';
import {
  Auth,
  authState,
  // signInAnonymously,
  signOut,
  User,
} from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';
import { Router, RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-auth',
  template: `
    <p>
      Auth!
      <code>{{ (user | async)?.uid }}</code>
      <button routerLink="./login" *ngIf="showLoginButton">Log in</button>
      <button (click)="logout()" *ngIf="showLogoutButton">Log out</button>
    </p>
  `,
  styles: [],
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe],
})
export class AuthComponent implements OnInit, OnDestroy {
  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginButton = false;
  showLogoutButton = false;

  constructor(
    @Optional() private auth: Auth,
    private router: Router,
  ) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth)
        .pipe(
          <any>traceUntilFirst('auth'),
          map((u) => !!u),
        )
        .subscribe((isLoggedIn: boolean) => {
          this.showLoginButton = !isLoggedIn;
          this.showLogoutButton = isLoggedIn;
        });
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  async logout() {
    return await signOut(this.auth);
  }
}
