import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// تأكد إن المسار ده صح عندك (حسب ما أنت عدلته)
import { ImageParserService } from '../../services/image-parser.service';
import { MessageService } from 'primeng/api';

// PrimeNG Modules
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
// شيلنا InputTextareaModule من هنا عشان مش محتاجينه وعامل مشاكل
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-image-parser',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    FileUploadModule, 
    ButtonModule, 
    // شيلنا InputTextareaModule من هنا كمان
    CardModule,
    ProgressSpinnerModule,
    ToastModule
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
  jsonKeys: string = ''; 
  
  isLoading = false;
  parsedResult: string | null = null;

  // Handle File Selection
  onFileSelect(event: any) {
    const file = event.files[0]; 
    if (file) {
      this.uploadedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  // Main Action
  processImage() {
    if (!this.uploadedFile) return;

    this.isLoading = true;
    this.parsedResult = null;

    this.service.createSession().subscribe({
      next: (chat: any) => {
        const chatId = chat.id;
        
        this.service.parseImage(chatId, this.uploadedFile!, this.jsonKeys).subscribe({
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

  // دالة الطوارئ (Data Mocking)
  private handleErrorWithMockData() {
    console.warn('Backend issue, showing mock data...');
    setTimeout(() => {
        this.isLoading = false;
        this.parsedResult = JSON.stringify({
            "status": "Mock Data (Dev Mode)",
            "extracted_info": {
                "name": "Ahmed Wael",
                "id": "123456789",
                "date": "2025-10-15",
                "items": [
                    { "item": "Laptop", "price": 25000 },
                    { "item": "Headphones", "price": 1500 }
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
    this.jsonKeys = '';
  }
}