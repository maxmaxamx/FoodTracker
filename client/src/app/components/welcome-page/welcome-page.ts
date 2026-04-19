import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

@Component({
  selector: 'app-welcome-page',
  imports: [Header, Footer],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.css',
})
export class WelcomePage {

}
