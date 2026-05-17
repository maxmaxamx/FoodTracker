import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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

  signupClick(): void {
    this.Authorize.signup(this.log).subscribe({
      next: (response) => {
        console.log('Успех:', response);
        this.router.navigate(['/twofa']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка сервера:', err);

        this.errorMessage = err.error?.message || 'Неизвестная ошибка';

        this.cdr.detectChanges();
      }
    });

  }

}
