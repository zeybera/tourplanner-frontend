import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';

@Component({
  selector: 'app-root', //In index.html <app-root></app-root> and replaces it with this component. That is how your app appears in the browser.
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html', // templateUrl points to the HTML file of this component. This file usually contains a <router-outlet>.
  // router-outlet is placeholder and it is the place where Angular dynamically renders components based on the current route.
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tourplanner');
}

// AppComponent
