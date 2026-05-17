import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Header } from "../header/header";
import { FormsModule } from '@angular/forms';
import { User } from '../../utils/identifiers';
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-login',
  imports: [Header, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected passType: string = "password";
  protected passIcon: string = "👁"
  protected errorMessage: string | null = null;
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected log: User = {
    email: "",
    username: "",
    password: ""
  }

  private Authorize: AuthService = inject(AuthService);

  constructor(private router: Router) { };

  togglePasswordVisibility(): void {
    if (this.passType === 'password') {
      this.passType = "text";
      this.passIcon = '🙈';
    } else {
      this.passType = 'password';
      this.passIcon = '👁';
    }
  }

  loginClick(): void {
    this.Authorize.login(this.log).subscribe({
      next: (response) => {
        console.log('Успех:', response);
        this.router.navigate(['/twofa']);
      },
      error: (err) => {
        console.error('Ошибка сервера:', err);

        this.errorMessage = err.error?.message || 'Неизвестная ошибка';

        this.cdr.detectChanges();
      }
    });
  }
}
