import { Component, inject } from '@angular/core';
import { AuthHead } from "../auth-head/auth-head";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FatsecretService } from '../../../services/fatsecret';

@Component({
  selector: 'app-add-food',
  imports: [AuthHead, FormsModule, CommonModule],
  templateUrl: './add-food.html',
  styleUrl: './add-food.css',
})
export class AddFood {
  private fatsecretService = inject(FatsecretService);

  query: string = '';
  foods: any[] = [];
  selectedFood: any = null;
  isLoading = false;

  search() {
    if (!this.query.trim()) {
      this.foods = [];
      return;
    }

    this.isLoading = true;

    this.fatsecretService.searchFoods(this.query).subscribe({
      next: data => {
        this.foods = data;
        this.isLoading = false;
        console.log('Найдено продуктов:', data.length);
        console.log('Первый продукт:', data[0]);
      },
      error: err => {
        console.error('Ошибка:', err);
        this.isLoading = false;
      }
    });
  }

  loadFood(id: string) {
    this.fatsecretService.getFoodById(id).subscribe({
      next: data => {
        this.selectedFood = data;
        console.log(' Продукт:', data);
      },
      error: err => {
        console.error(' Ошибка:', err);
      }
    });
  }

  getServing(food: any) {
    const servings = food?.servings?.serving;
    if (!servings) return null;
    return Array.isArray(servings) ? servings[0] : servings;
  }
}