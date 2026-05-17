import { Component, OnInit, inject } from '@angular/core';
import { Footer } from "../../footer/footer";
import { AuthHead } from "../auth-head/auth-head";
import { subDays } from '../../../utils/helpers';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../../../services/auth-service';
import { dateToChoose, DishList, Dish } from '../../../utils/identifiers';

@Component({
  selector: 'app-mainpage',
  imports: [AuthHead, FormsModule, RouterLink],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.css',
})
export class Mainpage implements OnInit {
  private weekHistory: Dish[] = [];
  DatesToShow: dateToChoose[] = [];
  chosen: number = 0;
  todayHistory: Dish[] = [];
  protected authService: AuthService = inject(AuthService);

  constructor(protected router: Router) { }

  ngOnInit(): void {
    for (let i = 0; i < 7; i++) {
      if (i === 0) {
        this.DatesToShow.push({ id: i, dateS: 'Сегодня', date: new Date })
      } else if (i === 1) {
        this.DatesToShow.push({ id: i, dateS: 'Вчера', date: subDays(i) })
      } else {
        this.DatesToShow.push({ id: i, dateS: subDays(i).toLocaleString('ru', { day: 'numeric', month: 'long' }), date: subDays(i) })
      }
    }
  }


}
