// Core
import { Component, OnInit } from '@angular/core';
import { UserService } from '@/_services';
import { User } from '@/_models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  public user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.userChanged$.subscribe(user => {
      this.user = user;
    });
  }
}
