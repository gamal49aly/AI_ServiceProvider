import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageParserService } from '../../services/image-parser.service';
import { MessageService } from 'primeng/api';
import { IParseImageResponse } from '../../models/image-parser.model';

// PrimeNG Modules
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-image-parser',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './image-parser.component.html',
  styleUrl: './image-parser.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageParserComponent {
  private readonly service = inject(ImageParserService);
  private readonly messageService = inject(MessageService);

  uploadedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  extractionKeys = signal<string[]>(['']);
  isLoading = signal(false);
  parsedResult = signal<IParseImageResponse | null>(null);

  validKeys = computed(() =>
    this.extractionKeys()
      .filter((k) => k.trim() !== '')
      .join(',')
  );

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  addKeyInput() {
    this.extractionKeys.update((keys) => [...keys, '']);
  }

  onKeyInput(index: number, value: string) {
    this.extractionKeys.update((keys) => {
      const newKeys = [...keys];
      newKeys[index] = value;
      return newKeys;
    });

    if (index === this.extractionKeys().length - 1 && value.trim().length > 0) {
      this.addKeyInput();
    }
  }

  removeKey(index: number) {
    if (this.extractionKeys().length === 1) {
      this.extractionKeys.set(['']);
      return;
    }
    this.extractionKeys.update((keys) => keys.filter((_, i) => i !== index));
  }

  clearAllKeys() {
    this.extractionKeys.set(['']);
  }

  processImage() {
    const file = this.uploadedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.parsedResult.set(null);

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

        this.service.parseImage(chatId, file, this.validKeys()).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.parsedResult.set(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Image analyzed successfully.',
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
      this.parsedResult.set({
        inputId: 'mock-id-' + Math.random().toString(36).substr(2, 9),
        parsedData: JSON.stringify(
          {
            status: 'Mock Data',
            extracted_info: {
              items: [
                { item: 'Laptop', price: 25000 },
                { item: 'Mouse', price: 500 },
              ],
            },
          },
          null,
          2
        ),
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
    this.imagePreview.set(null);
    this.parsedResult.set(null);
    this.extractionKeys.set(['']);
  }

  copyToClipboard() {
    const result = this.parsedResult()?.parsedData;
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Copied',
          detail: 'JSON result copied to clipboard.',
        });
      });
    }
  }
}
