import { ChangeDetectorRef, Component, inject, viewChild, ElementRef, DestroyRef } from '@angular/core';
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
  private destroyRef = inject(DestroyRef);
  private aiService = inject(Artificial);

  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected selectedFile: File | null = null;
  protected previewUrl: string | null = null;
  protected isLoading = false;
  protected aiResponse = '';

  private _chatHistory: messageTemplate[] = [];

  get chatHistory() {
    return this._chatHistory;
  }

  get isImage(): boolean {
    return this.selectedFile?.type.startsWith('image/') ?? false;
  }

  private _getCurrentTime(): string {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
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
      if (typeof parsed !== 'object' || parsed === null) return fallback;

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

    if (!file) return;

    this.selectedFile = file;

    if (this.isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }

    this.cdr.detectChanges();
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    const inputRef = this.fileInput();
    if (inputRef) inputRef.nativeElement.value = '';
  }

  sendFile() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    const currentTime = this._getCurrentTime();

    this._chatHistory.push({
      isAI: false,
      text: 'фотография еды',
      time: currentTime
    });

    this.aiService.sendFood(this.selectedFile)
      .subscribe({
        next: (data: string) => {
          this._chatHistory.push({
            isAI: true,
            data: this._parseFoodData(data),
            time: this._getCurrentTime()
          });
          this.removeFile();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка при отправке:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }
}