import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthHead } from "../../authorized/auth-head/auth-head";
import { Artificial } from '../../../services/artificial';
import { Message } from "../message/message";
import { FoodExample, messageTemplate } from '../../../utils/identifiers';

@Component({
  selector: 'app-ai-chat',
  imports: [AuthHead, Message],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css',
})
export class AiChat {
  private cdr = inject(ChangeDetectorRef);
  protected time: Date = new Date();
  protected selectedFile: File | null = null;
  protected previewUrl: string | null = null;
  protected aiService = inject(Artificial);
  isLoading: boolean = true;
  aiResponse: string = '';

  currentTime: string = `${this.time.getHours()} : ${this.time.getMinutes()}`;
  senderPerson: boolean = true;

  private _chatHistory: messageTemplate[] = [];

  get chatHistory() {
    return this._chatHistory;
  }

  get isImage(): boolean {
    return this.selectedFile?.type.startsWith('image/') ?? false;
  }


  private _parseFoodData(data: string): FoodExample {
    const fallback: FoodExample = {
      Id: 0,
      Name: 'unknown',
      Calories: 0,
      Fats: 0,
      Carbs: 0,
      Proteins: 0,
      Intake: "Breakfast"
    };

    try {
      const parsed = JSON.parse(data);

      if (typeof parsed !== 'object' || parsed === null) {
        return fallback;
      }

      const hasValidFields =
        typeof parsed.Name === 'string' &&
        typeof parsed.Calories === 'number' &&
        typeof parsed.Fats === 'number' &&
        typeof parsed.Carbs === 'number' &&
        typeof parsed.Proteins === 'number';

      return hasValidFields ? (parsed as FoodExample) : fallback;
    } catch {
      return fallback;
    }
  }



  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;

      if (this.isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);

      }
    }

    this.cdr.detectChanges();
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    const input = document.getElementById('file') as HTMLInputElement;
    if (input) input.value = '';
  }

  sendFile() {
    if (!this.selectedFile) return
    this.isLoading = true;
    this._chatHistory.push({
      isAI: false,
      text: 'фотография еды',
      time: this.currentTime
    })

    this.aiService.sendFood(this.selectedFile).subscribe({
      next: (data: string) => {
        this._chatHistory.push({
          isAI: true,
          data: this._parseFoodData(data),
          time: this.currentTime
        })
        this.removeFile();
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка при отправке:', err);
        this.cdr.detectChanges();
      }
    });
  }
}
