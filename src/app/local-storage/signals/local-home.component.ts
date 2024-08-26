import { Component } from '@angular/core';
import HomeComponent from '../../shared/components/home/home.component';
import HeaderComponent from './header.component';

@Component({
  selector: 'app-local-home',
  standalone: true,
  template: `
    <app-header />
    <app-home />
  `,
  imports: [HeaderComponent, HomeComponent],
})
export default class LocalHomeComponent {}
