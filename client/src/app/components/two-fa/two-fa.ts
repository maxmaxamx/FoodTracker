import { Component, inject } from '@angular/core';
import { Header } from "../header/header";
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-two-fa',
  imports: [Header, FormsModule],
  templateUrl: './two-fa.html',
  styleUrl: './two-fa.css',
})
export class TwoFA {
  private AuthorizeService: AuthService = inject(AuthService)
  protected code: string = '';
  errorMessage: string = '';

  constructor(private router: Router) { }

  private sendCode(): void {
    this.AuthorizeService.sendCode(this.code).subscribe({
      next: (response) => {
        console.log('Успех:', response);
        this.router.navigate(['authorized']);
      },
      error: (err) => {
        if (err.status = 400) {
          this.errorMessage = err.message;
        }
      }
    });
  }
}
