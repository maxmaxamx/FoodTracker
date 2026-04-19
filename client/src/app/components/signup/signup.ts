import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { User } from '../../utils/identifiers';
import { Header } from "../header/header";

@Component({
  selector: 'app-signup',
  imports: [RouterLink, Header],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
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
