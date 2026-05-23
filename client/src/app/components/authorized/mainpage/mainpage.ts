import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Footer } from "../../footer/footer";
import { AuthHead } from "../auth-head/auth-head";
import { subDays } from '../../../utils/helpers';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { dateToChoose, FoodExample } from '../../../utils/identifiers';
import { SendFood } from '../../../services/send-food';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  imports: [AuthHead, FormsModule],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Mainpage implements OnInit {
  private weekHistory: FoodExample[] = [];
  DatesToShow: dateToChoose[] = [];
  chosen: number = 0;
  todayHistory: FoodExample[] = [];
  breakfastHistory: FoodExample[] = [];
  lunchHistory: FoodExample[] = [];
  dinnerHistory: FoodExample[] = [];
  protected authService: AuthService = inject(AuthService);
  protected foodService = inject(SendFood);
  isExpanded = { breakfast: true, lunch: true, dinner: true };
  private cdr = inject(ChangeDetectorRef);
  private dateObj!: Date;
  private dateStr!: string;

  constructor(protected router: Router) { }

  ngOnInit(): void {
    for (let i = 0; i < 7; i++) {
      if (i === 0) {
        this.DatesToShow.push({ id: i, dateS: 'Сегодня', date: new Date() });
      } else if (i === 1) {
        this.DatesToShow.push({ id: i, dateS: 'Вчера', date: subDays(i) });
      } else {
        this.DatesToShow.push({ id: i, dateS: subDays(i).toLocaleString('ru', { day: 'numeric', month: 'long' }), date: subDays(i) });
      }
    }

    this.updateDateVars();
    this.getTodayFood();
  }

  get totalCalories(): number {
    return this.todayHistory.reduce((s, f) => s + (f.Calories ?? 0), 0);
  }

  get totalProteins(): number {
    return this.todayHistory.reduce((s, f) => s + (f.Proteins ?? 0), 0);
  }

  get totalFats(): number {
    return this.todayHistory.reduce((s, f) => s + (f.Fats ?? 0), 0);
  }

  get totalCarbs(): number {
    return this.todayHistory.reduce((s, f) => s + (f.Carbs ?? 0), 0);
  }

  toggleTable(type: 'breakfast' | 'lunch' | 'dinner'): void {
    this.isExpanded[type] = !this.isExpanded[type];
  }

  click(): void {
    this.updateDateVars();
    this.foodService.setfoodDay(this.dateStr);
    this.getTodayFood();
  }

  private updateDateVars(): void {
    this.dateObj = this.DatesToShow[this.chosen].date;
    this.dateStr = this.dateObj.toLocaleDateString('en-CA');
    this.foodService.setfoodDay(this.dateStr);
  }

  protected getTodayFood(): void {
    this.foodService.getFoodList(this.dateStr).subscribe({
      next: (res) => {
        this.todayHistory = res;
        this.cdr.detectChanges();
        this.breakfastHistory = res.filter((item) => item.Intake === 'Breakfast');
        this.lunchHistory = res.filter((item) => item.Intake === 'Lunch');
        this.dinnerHistory = res.filter((item) => item.Intake === 'Dinner');
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  protected deleteClick(idToDelete: number): void {
    this.foodService.deleteFood(idToDelete).subscribe({
      next: (response) => {
        console.log('Удалено успешно', response);
        for (let i = 0; i < this.todayHistory.length; i++) {

        }
        this.todayHistory = this.todayHistory.filter((item) => item.Id !== idToDelete);

        this.breakfastHistory = this.todayHistory.filter((item) => item.Intake === 'Breakfast');
        this.lunchHistory = this.todayHistory.filter((item) => item.Intake === 'Lunch');
        this.dinnerHistory = this.todayHistory.filter((item) => item.Intake === 'Dinner');

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Ошибка при удалении', err)
    })
  }

}