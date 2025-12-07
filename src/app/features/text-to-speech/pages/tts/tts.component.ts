import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TtsService } from '../../services/tts.service';
import { MessageService } from 'primeng/api';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-tts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ToastModule,
    SliderModule
  ],
  providers: [MessageService],
  templateUrl: './tts.component.html',
  styleUrl: './tts.component.css'
})
export class TtsComponent implements OnInit {
  service = inject(TtsService);
  messageService = inject(MessageService);

  textToConvert: string = '';
  selectedVoice: string = 'en-US';
  isLoading = false;
  isAudioReady = false;
  
  voices = [
    { name: 'English (United States)', code: 'en-US' },
    { name: 'English (United Kingdom)', code: 'en-GB' },
    { name: 'Arabic (العربية)', code: 'ar-SA' }
  ];

  ngOnInit() {
    // Preload voices for better UX
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }
  }

  generateAudio() {
    if (!this.textToConvert.trim()) return;

    this.isLoading = true;
    this.isAudioReady = false;

    this.service.convertTextToSpeech(this.textToConvert, this.selectedVoice).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isAudioReady = true;
        
        this.speakBrowser(this.textToConvert);
        
        this.messageService.add({ severity: 'success', summary: 'Generated', detail: 'Audio is playing...' });
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  speakBrowser(text: string) {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = this.selectedVoice; 
      
      // Adjust rate for Arabic for better clarity
      if (this.selectedVoice === 'ar-SA') {
          utterance.rate = 1.1; 
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  clear() {
    this.textToConvert = '';
    this.isAudioReady = false;
    window.speechSynthesis.cancel();
  }
}