import { Component, inject } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { User } from '../../utils/identifiers';
import { Header } from "../header/header";
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, Header, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  protected passType: string = "password";
  protected passIcon: string = "👁"
  protected errorMessage: string = '';
  private Authorize: AuthService = inject(AuthService);

  protected log: User = {
    email: "",
    username: "",
    password: ""
  }

  constructor(private router: Router) { }

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
        this.router.navigate(['/2fa']);
      },
      error: (err) => {
        console.error('Ошибка сервера:', err);

        const serverMessage = err.error?.message || 'Неизвестная ошибка';

        if (err.status === 409) {
          this.errorMessage = err.error;
        } else if (err.status === 500) {
          this.errorMessage = serverMessage;
        } else {
          this.errorMessage = 'Сервер недоступен';
        }
      }
    });
  }

}
