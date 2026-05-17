import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Theme } from '../../../services/theme';
import { AuthResponse, AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-auth-head',
  imports: [RouterLink],
  templateUrl: './auth-head.html',
  styleUrl: './auth-head.css',
})
export class AuthHead {
  protected themeChanger = inject(Theme);
  protected authService: AuthService = inject(AuthService);


  logout() {
    this.authService.logout();
  }
}
