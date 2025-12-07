import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SttService } from '../../services/stt.service';
import { MessageService } from 'primeng/api';

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
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './stt.component.html',
  styleUrl: './stt.component.css'
})
export class SttComponent {
  service = inject(SttService);
  messageService = inject(MessageService);

  uploadedFile: File | null = null;
  audioUrl: string | null = null;
  
  isLoading = false;
  convertedText: string | null = null;

  // Handle Audio Selection
  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFile = file;
      // Create URL for audio player
      this.audioUrl = URL.createObjectURL(file);
      this.convertedText = null;
    }
  }

  // Convert Action
  processAudio() {
    if (!this.uploadedFile) return;

    this.isLoading = true;
    
    this.service.convertSpeechToText(this.uploadedFile).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.convertedText = res.text;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Audio converted successfully!' });
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong.' });
      }
    });
  }

  clear() {
    this.uploadedFile = null;
    this.audioUrl = null;
    this.convertedText = null;
  }
}