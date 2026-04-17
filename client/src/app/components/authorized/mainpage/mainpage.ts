import { Component, OnInit } from '@angular/core';
import { Footer } from "../../footer/footer";
import { AuthHead } from "../auth-head/auth-head";
import { subDays } from '../../../utils/helpers';
import { FormsModule } from '@angular/forms';

interface dateToChoose {
  id: number,
  dateS: string,
  date: Date
}

interface Dish{
  name: string,
  carbs: number,
  fats: number,
  proteins: number,
  calories: number
}

interface DishList{
  time: string,
  food: Dish[];
}


@Component({
  selector: 'app-mainpage',
  imports: [AuthHead, FormsModule],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.css',
})
export class Mainpage {
  private weekHistory: Dish[]=[];
  DatesToShow: dateToChoose[] = [];
  chosen: number = 0;
  todayHistory: Dish[] = [];

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
