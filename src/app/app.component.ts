import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '@/_services';
import { User } from '@/_models';

import '@/_content/app.scss';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  title = 'samyounger-admin';
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
    ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
