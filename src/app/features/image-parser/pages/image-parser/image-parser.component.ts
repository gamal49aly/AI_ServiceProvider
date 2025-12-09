import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageParserService } from '../../services/image-parser.service';
import { MessageService } from 'primeng/api';

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
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './image-parser.component.html',
  styleUrl: './image-parser.component.css'
})
export class ImageParserComponent {
  service = inject(ImageParserService);
  messageService = inject(MessageService);

  uploadedFile: File | null = null;
  imagePreview: string | null = null;

  extractionKeys: string[] = [''];

  isLoading = false;
  parsedResult: string | null = null;

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }
  addKeyInput() {
    this.extractionKeys.push('');
  }
  onKeyInput(index: number, value: string) {
    if (index === this.extractionKeys.length - 1 && value.trim().length > 0) {
      this.addKeyInput();
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  removeKey(index: number) {
    if (this.extractionKeys.length === 1) {
      this.extractionKeys[0] = '';
      return;
    }
    this.extractionKeys.splice(index, 1);
  }

  clearAllKeys() {
    this.extractionKeys = [''];
  }

  processImage() {
    if (!this.uploadedFile) return;

    this.isLoading = true;
    this.parsedResult = null;

    const validKeys = this.extractionKeys
      .filter(k => k.trim() !== '')
      .join(',');

    this.service.createSession().subscribe({
      next: (chat: any) => {
        const chatId = chat.id;

        this.service.parseImage(chatId, this.uploadedFile!, validKeys).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.parsedResult = res.parsedData;
            this.messageService.add({ severity: 'success', summary: 'Done!', detail: 'Image analyzed successfully.' });
          },
          error: (err) => {
            this.handleErrorWithMockData();
          }
        });
      },
      error: (err) => {
        this.handleErrorWithMockData();
      }
    });
  }

  private handleErrorWithMockData() {
    console.warn('Backend issue, showing mock data...');
    setTimeout(() => {
      this.isLoading = false;
      this.parsedResult = JSON.stringify({
        "status": "Mock Data",
        "extracted_info": {
          "items": [
            { "item": "Laptop", "price": 25000 },
            { "item": "Mouse", "price": 500 }
          ]
        }
      }, null, 2);

      this.messageService.add({ severity: 'warn', summary: 'Dev Mode', detail: 'Server error, showing mock data.' });
    }, 2000);
  }

  clear() {
    this.uploadedFile = null;
    this.imagePreview = null;
    this.parsedResult = null;
    this.extractionKeys = [''];
  }
}