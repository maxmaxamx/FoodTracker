import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Theme } from '../../../services/theme';

@Component({
  selector: 'app-auth-head',
  imports: [RouterLink],
  templateUrl: './auth-head.html',
  styleUrl: './auth-head.css',
})
export class AuthHead {
  protected themeChanger = inject(Theme);
}
