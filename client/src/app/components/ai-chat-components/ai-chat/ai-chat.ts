import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthHead } from "../../authorized/auth-head/auth-head";
import { Artificial } from '../../../services/artificial';
import { Message } from "../message/message";

@Component({
  selector: 'app-ai-chat',
  imports: [AuthHead, Message],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css',
})
export class AiChat {
  private cdr = inject(ChangeDetectorRef);

  protected selectedFile: File | null = null;
  protected previewUrl: string | null = null;
  protected aiService = inject(Artificial);
  isLoading: boolean = true;

  aiResponse: string = '';

  get isImage(): boolean {
    return this.selectedFile?.type.startsWith('image/') ?? false;
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
        this.cdr.detectChanges();
      }
    }
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

    this.aiService.sendFood(this.selectedFile).subscribe({
      next: (data: string) => {
        this.aiResponse = data;
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
