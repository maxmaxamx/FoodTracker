import { ChangeDetectorRef, Component, EventEmitter, inject, Input } from '@angular/core';
import { required } from '@angular/forms/signals';
import { FoodExample } from '../../../utils/identifiers';
import { SendFood } from '../../../services/send-food';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message {

  @Input({ required: true }) sender: boolean = true;
  @Input({ required: false }) text: string = ''
  @Input({ required: false }) foodData: FoodExample = {
    Id: 0,
    Name: 'unknown',
    Calories: 0,
    Fats: 0,
    Carbs: 0,
    Proteins: 0,
    Intake: "Breakfast"
  };
  @Input({ required: true }) time: string = '00:00'

  private foodService = inject(SendFood);



  protected pushFoodItem(): void {
    if (this.foodService.foodDay() != '') {
      this.foodService.send({ ...this.foodData, Intake: this.foodService.timeIntake(), date: this.foodService.foodDay() }).subscribe({
        next: () => {
          window.alert('Еда добавлена в базу')
        },
        error: (err) => {
          window.alert('Ошибка при отправке:' + err.error?.message || err.message || 'Неизвестная ошибка сервера');
        }
      })
    } else {
      console.log("Ошибка, нету даты добавления");
    }
  }


}
