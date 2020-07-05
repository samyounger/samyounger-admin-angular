import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AuthenticationService } from '@/_services';

// Models
import { User } from '@/_models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() public user: User;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
