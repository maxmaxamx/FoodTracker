import { Component } from '@angular/core';
import { Header } from "../header/header";
import { FormsModule } from '@angular/forms';
import { User } from '../../utils/identifiers';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-login',
  imports: [Header, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected passType: string = "password";
  protected passIcon: string = "👁"

  protected log: User = {
    email: "",
    password: ""
  }

  togglePasswordVisibility(): void {
    if (this.passType === 'password') {
      this.passType = "text";
      this.passIcon = '🙈';
    } else {
      this.passType = 'password';
      this.passIcon = '👁';
    }
  }
}
