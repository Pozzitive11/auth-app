import { Component, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth';
import { Auth } from '@modules/auth/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (localStorage.getItem(Auth.accessToken)) {
      this.authService.refreshToken().subscribe();
    }
  }
}
