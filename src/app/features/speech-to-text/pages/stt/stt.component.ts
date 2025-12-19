import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SttService } from '../../services/stt.service';
import { MessageService } from 'primeng/api';
import { ISpeechToTextResponse } from '../../models/stt.model';

// PrimeNG Modules
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-stt',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './stt.component.html',
  styleUrl: './stt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SttComponent {
  private readonly service = inject(SttService);
  private readonly messageService = inject(MessageService);

  uploadedFile = signal<File | null>(null);
  audioUrl = signal<string | null>(null);
  isLoading = signal(false);
  convertedText = signal<ISpeechToTextResponse | null>(null);

  // Handle Audio Selection
  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFile.set(file);
      // Create URL for audio player
      this.audioUrl.set(URL.createObjectURL(file));
      this.convertedText.set(null);
    }
  }

  // Convert Action
  processAudio() {
    const file = this.uploadedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.convertedText.set(null);

    this.service.createSession().subscribe({
      next: (chat) => {
        const chatId = chat?.id || chat?.ChatId;
        if (!chatId) {
          console.error('No Chat ID found in session response:', chat);
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Session Error',
            detail: 'Could not create a valid session.',
          });
          return;
        }

        this.service.convertSpeechToText(chatId, file).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.convertedText.set(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Audio converted successfully!',
            });
          },
          error: (err) => {
            console.error('API Error:', err);
            this.handleErrorWithMockData();
          },
        });
      },
      error: (err) => {
        console.error('Session Error:', err);
        this.handleErrorWithMockData();
      },
    });
  }

  private handleErrorWithMockData() {
    console.warn('Backend issue, showing mock data...');
    setTimeout(() => {
      this.isLoading.set(false);
      this.convertedText.set({
        inputId: 'mock-id-' + Math.random().toString(36).substr(2, 9),
        transcribedText:
          'This is a simulated result from the AI model (Fallback). The audio processing was successful, but we currently cannot reach the server.',
      });

      this.messageService.add({
        severity: 'warn',
        summary: 'Dev Mode',
        detail: 'Server error, showing mock data.',
      });
    }, 1500);
  }

  clear() {
    this.uploadedFile.set(null);
    this.audioUrl.set(null);
    this.convertedText.set(null);
  }

  copyToClipboard() {
    const text = this.convertedText()?.transcribedText;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Copied',
          detail: 'Text copied to clipboard.',
        });
      });
    }
  }
}
