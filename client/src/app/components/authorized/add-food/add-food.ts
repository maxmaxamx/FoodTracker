import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { AuthHead } from "../auth-head/auth-head";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FatsecretService } from '../../../services/fatsecret';
import { splitArray } from '../../../utils/helpers';
import { FoodExample } from '../../../utils/identifiers';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-add-food',
  imports: [AuthHead, FormsModule, CommonModule, RouterLink],
  templateUrl: './add-food.html',
  styleUrl: './add-food.css',
})
export class AddFood {
  private cdr = inject(ChangeDetectorRef);
  private fatsecretService = inject(FatsecretService);

  protected query: string = '';
  protected foods: any[] = [];

  protected selectedFood: any = null;
  protected isLoading: boolean = false;
  protected notfound: boolean = false

  search() {
    if (!this.query.trim()) {
      this.foods = [];
      return;
    }

    this.isLoading = true;
    this.notfound = false;

    this.fatsecretService.searchFoods(this.query).subscribe({
      next: data => {
        const processed: any[] = splitArray(data);
        this.foods = [...processed];
        this.isLoading = false;
        if (data.length === 0)
          this.notfound = true    
        console.log('Первый продукт:', data[0]);
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Ошибка:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFood(id: string) {
    // this.fatsecretService.getFoodById(id).subscribe({
    //   next: data => {
    //     this.selectedFood = data;
    //     console.log(' Продукт:', data);
    //   },
    //   error: err => {
    //     console.error(' Ошибка:', err);
    //   }
    // });    
  }

  getServing(food: any) {
    const servings = food?.servings?.serving;
    if (!servings) return null;
    return Array.isArray(servings) ? servings[0] : servings;
  }

  applyFood(){
    
  }
}