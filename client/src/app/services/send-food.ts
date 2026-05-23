import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { FoodExample, Intakes } from '../utils/identifiers';
import { Router } from '@angular/router';

export interface sendFoodExample {
  Name: string,
  Calories: number,
  Fats: number,
  Carbs: number,
  Proteins: number,
  Intake: string,
  date: string
}



@Injectable({
  providedIn: 'root',
})
export class SendFood {
  private http: HttpClient = inject(HttpClient);

  timeIntake = signal<Intakes>('Breakfast');
  foodDay = signal<string>('');


  constructor(protected router: Router) { };

  setBreakfast(): void {
    this.timeIntake.set('Breakfast');
    this.router.navigate(['/add'])
  }

  setLunch(): void {
    this.timeIntake.set('Lunch');
    this.router.navigate(['/add'])
  }

  setDinner(): void {
    this.timeIntake.set('Dinner');
    this.router.navigate(['/add'])
  }

  setfoodDay(date: string): void {
    this.foodDay.set(date);
  }

  send(foodOnLoad: sendFoodExample) {
    console.log(foodOnLoad);
    return this.http.post<sendFoodExample>('/api/pushFood', foodOnLoad, { withCredentials: true })
  }

  getFoodList(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<FoodExample[]>('/api/getFood', { params, withCredentials: true })
  }

  deleteFood(id: number) {
    return this.http.delete<string>(`/api/deleteFood/${id}`, { withCredentials: true })
  }
}
