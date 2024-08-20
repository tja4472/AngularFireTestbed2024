import { Component, OnInit, Optional } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <p>
      <button (click)="loginWithGoogle()">Log in with Google</button>
      <button (click)="loginAnonymously()">Log in with Anonymously</button>
    </p>
  `,
  styles: [],
  standalone: true,
})
export class LoginComponent implements OnInit {
  redirect = ['../'];

  constructor(
    @Optional() private auth: Auth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(this.redirect, {
      relativeTo: this.activatedRoute,
    });
  }

  async loginAnonymously() {
    await signInAnonymously(this.auth);
    // await this.router.navigate(this.redirect);
    await this.router.navigate(this.redirect, {
      relativeTo: this.activatedRoute,
    });
  }
}
