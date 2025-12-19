import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TtsService } from '../../services/tts.service';
import { MessageService } from 'primeng/api';
import { ITtsVoice } from '../../models/tts.model';
import { TTS_VOICES } from '../../constants/tts-voices.constants';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-tts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ToastModule,
    SliderModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './tts.component.html',
  styleUrl: './tts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TtsComponent implements OnInit, OnDestroy {
  private readonly service = inject(TtsService);

  private readonly messageService = inject(MessageService);

  audioUrl = signal<string | null>(null);
  private audio: HTMLAudioElement | null = null;

  // Demo audio handling
  private demoAudio: HTMLAudioElement | null = null;
  playingDemo = signal<string | null>(null);

  textToConvert = signal('');
  selectedVoice = signal('Achernar');
  isLoading = signal(false);
  isAudioReady = signal(false);

  voices = signal<ITtsVoice[]>([]);

  ngOnInit() {
    this.loadVoices();
  }

  loadVoices() {
    this.service.getVoices().subscribe({
      next: (res) => {
        if (Array.isArray(res) && res.length > 0) {
          // Map backend string names to full ITtsVoice data from TTS_VOICES
          const mappedVoices = res.map((v: any) => {
            const name =
              typeof v === 'string' ? v : v.name || v.displayName || v.code;
            const found = TTS_VOICES.find((voice) => voice.name === name);

            if (found) return found;

            // Fallback
            return {
              name,
              gender: typeof v === 'object' && v.gender ? v.gender : 'Unknown',
              previewUrl: typeof v === 'object' && v.url ? v.url : '',
            };
          });
          this.voices.set(mappedVoices);
        }
      },
      error: (err) => {
        console.warn('Could not load voices from API, using defaults.', err);
        this.voices.set([...TTS_VOICES]);
      },
    });
  }

  /**
   * for a more deatlaied dto response from the api
   *
   * loadVoicesWithFullDto() {
   *   this.service.getVoices().subscribe({
   *     next: (res: ITtsVoice[]) => {
   *       if (Array.isArray(res) && res.length > 0) {
   *         this.voices.set(res);
   *       } else {
   *         this.voices.set([...TTS_VOICES]);
   *       }
   *     },
   *     error: (err) => {
   *       console.warn('Could not load voices from API, using defaults.', err);
   *       this.voices.set([...TTS_VOICES]);
   *     }
   *   });
   * }
   */

  playVoiceDemo(event: Event, voice: ITtsVoice) {
    event.stopPropagation(); // Prevent selecting the voice when clicking play

    if (this.playingDemo() === voice.name) {
      this.stopDemo();
      return;
    }

    this.stopDemo();

    if (!voice.previewUrl) return;

    this.demoAudio = new Audio(voice.previewUrl);

    this.playingDemo.set(voice.name);

    this.demoAudio.onended = () => {
      this.playingDemo.set(null);
    };

    this.demoAudio.play().catch((err) => {
      console.error('Demo playback failed:', err);
      this.playingDemo.set(null);
    });
  }

  private stopDemo() {
    if (this.demoAudio) {
      this.demoAudio.pause();
      this.demoAudio.src = '';
      this.demoAudio = null;
    }
    this.playingDemo.set(null);
  }

  selectVoice(voiceName: string) {
    this.selectedVoice.set(voiceName);
  }

  generateAudio() {
    const text = this.textToConvert().trim();
    if (!text) return;

    this.isLoading.set(true);
    this.isAudioReady.set(false);

    this.service.createSession().subscribe({
      next: (chat) => {
        const chatId = chat?.id || chat?.ChatId;
        if (!chatId) {
          this.handleError('Could not create a valid session.');
          return;
        }

        const payload = {
          chatId: chatId,
          text: text,
          voice: this.selectedVoice(),
        };

        this.service.convertTextToSpeech(payload).subscribe({
          next: (blob) => {
            this.isLoading.set(false);
            this.isAudioReady.set(true);

            // Clean up previous resources
            this.cleanupAudio();

            // Create playable URL
            const url = URL.createObjectURL(blob);
            this.audioUrl.set(url);

            // Play
            this.audio = new Audio(url);
            this.audio.play().catch((err) => {
              console.error('Audio playback failed:', err);
              this.messageService.add({
                severity: 'warn',
                summary: 'Playback Issue',
                detail:
                  'Audio generated, but auto-play was blocked by the browser.',
              });
            });

            this.messageService.add({
              severity: 'success',
              summary: 'Generated',
              detail: 'Audio is ready to play.',
            });
          },
          error: (err) => {
            console.error('TTS Synthesis Error:', err);
            this.handleError(
              err?.error?.message || 'Failed to generate speech'
            );
          },
        });
      },
      error: (err) => {
        console.error('Session Error:', err);
        this.handleError('Server error, could not start session.');
      },
    });
  }

  private handleError(detail: string) {
    this.isLoading.set(false);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail,
    });
  }

  playAudio() {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }

  clear() {
    this.textToConvert.set('');
    this.isAudioReady.set(false);
    this.cleanupAudio();
  }

  private cleanupAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    const currentUrl = this.audioUrl();
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
      this.audioUrl.set(null);
    }
    this.stopDemo();
  }

  ngOnDestroy() {
    this.cleanupAudio();
  }
}
