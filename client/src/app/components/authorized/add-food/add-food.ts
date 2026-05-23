import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { AuthHead } from "../auth-head/auth-head";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FatsecretService } from '../../../services/fatsecret';
import { splitArray } from '../../../utils/helpers';
import { RouterLink } from "@angular/router";
import { SendFood } from '../../../services/send-food';

@Component({
  selector: 'app-add-food',
  imports: [AuthHead, FormsModule, CommonModule, RouterLink],
  templateUrl: './add-food.html',
  styleUrl: './add-food.css',
})
export class AddFood {
  private cdr = inject(ChangeDetectorRef);
  private fatsecretService = inject(FatsecretService);
  private foodService = inject(SendFood);

  protected query: string = '';

  private foodsOriginal: any[] = [];
  protected foods: any[] = [];

  protected selectedFood: any = null;
  protected isLoading: boolean = false;
  protected notfound: boolean = false;

  editingRowId: number | null = null;

  draftValue: number | string | null = 100;

  currentWeight: number = 100;

  search() {
    if (!this.query.trim()) {
      this.foods = [];
      this.foodsOriginal = [];
      return;
    }

    this.isLoading = true;
    this.notfound = false;

    this.fatsecretService.searchFoods(this.query).subscribe({
      next: data => {
        const processed = splitArray(data);

        this.foodsOriginal = processed.map(food => ({ ...food }));

        this.currentWeight = 100;
        this.draftValue = 100;

        this.recalculateFoods();

        this.isLoading = false;
        this.notfound = data.length === 0;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Ошибка:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(food: any): void {
    this.editingRowId = food.id;
    this.draftValue = this.currentWeight;
  }

  saveEdit(): void {
    if (this.draftValue === null || this.draftValue === undefined || this.draftValue === '') {
      return;
    }

    const newWeight = Number(this.draftValue);

    if (isNaN(newWeight) || newWeight <= 0) {
      return;
    }

    this.currentWeight = newWeight;
    this.recalculateFoods();

    this.editingRowId = null;
    this.draftValue = this.currentWeight;
  }

  cancelEdit(): void {
    this.editingRowId = null;
    this.draftValue = this.currentWeight;
  }

  private recalculateFoods(): void {
    const weightRatio = this.currentWeight / 100;

    this.foods = this.foodsOriginal.map(food => ({
      id: food.id,
      name: food.name,
      protein: +(food.protein * weightRatio).toFixed(1),
      fat: +(food.fat * weightRatio).toFixed(1),
      carbs: +(food.carbs * weightRatio).toFixed(1),
      calories: +(food.calories * weightRatio).toFixed(1),
    }));
  }

  applyAdding(food: any): void {
    if (this.foodService.foodDay() === '') return;

    this.foodService.send({
      Name: food.name,
      Calories: Math.round(food.calories),
      Fats: Math.round(food.fat),
      Carbs: Math.round(food.carbs),
      Proteins: Math.round(food.protein),
      Intake: this.foodService.timeIntake(),
      date: this.foodService.foodDay()
    }).subscribe({
      next: () => {
        window.alert('Еда добавлена в базу');
      },
      error: (err) => {
        window.alert('Ошибка при отправке: ' + (err.error?.message || err.message || 'Неизвестная ошибка сервера'));
      }
    });
  }
}