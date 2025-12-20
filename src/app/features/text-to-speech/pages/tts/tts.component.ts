import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TtsService } from '../../services/tts.service';
import { MessageService } from 'primeng/api';
import { ITtsVoice, TtsChat, TtsHistoryRow } from '../../models/tts.model';
import { TTS_VOICES } from '../../constants/tts-voices.constants';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

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
    DrawerModule,
    DividerModule,
    BadgeModule,
  ],
  providers: [MessageService],
  templateUrl: './tts.component.html',
  styleUrl: './tts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TtsComponent implements OnInit, OnDestroy {
  private readonly service = inject(TtsService);
  private readonly messageService = inject(MessageService);

  // --- State & Signals ---
  audioUrl = signal<string | null>(null);
  textToConvert = signal('');
  selectedVoice = signal('Achernar');
  isLoading = signal(false);
  isAudioReady = signal(false);

  voices = signal<ITtsVoice[]>([]);
  chats = signal<TtsChat[]>([]);
  history = signal<TtsHistoryRow[]>([]);
  selectedChatId = signal<string | null>(null);
  showHistoryDrawer = signal(false);
  isLoadingHistory = signal(false);

  // Computed signals
  activeChat = computed(() =>
    this.chats().find((c) => c.id === this.selectedChatId())
  );

  private audio: HTMLAudioElement | null = null;
  private demoAudio: HTMLAudioElement | null = null;
  playingDemo = signal<string | null>(null);

  // --- Lifecycle ---
  ngOnInit() {
    this.loadVoices();
    this.loadChats();
  }

  ngOnDestroy() {
    this.cleanupAudio();
  }

  // --- Session & Chat Management ---
  loadChats() {
    this.service.getChats().subscribe({
      next: (res) => this.chats.set(res),
      error: (err) => console.error('Failed to load chats', err),
    });
  }

  selectChat(chatId: string) {
    this.selectedChatId.set(chatId);
    this.showHistoryDrawer.set(false);
    this.loadHistory(chatId);
  }

  createNewSession() {
    this.service.createSession().subscribe({
      next: (chat) => {
        const id = chat.id || chat.ChatId;
        this.selectedChatId.set(id);
        this.loadChats();
        this.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'New Session',
          detail: 'New TTS session started.',
        });
      },
      error: (err) =>
        this.handleError('Server error, could not start session.'),
    });
  }

  // --- History Management ---
  loadHistory(chatId: string) {
    this.isLoadingHistory.set(true);
    this.service.getHistory(chatId).subscribe({
      next: (res) => {
        this.history.set(res);
        this.isLoadingHistory.set(false);
      },
      error: (err) => {
        console.error('Failed to load history', err);
        this.isLoadingHistory.set(false);
      },
    });
  }

  viewHistoryRecord(record: TtsHistoryRow) {
    this.cleanupAudio();
    this.textToConvert.set(record.inputText);
    this.selectedVoice.set(record.voiceName);

    if (record.audioData) {
      const url = this.base64ToBlobUrl(record.audioData);
      this.audioUrl.set(url);
      this.isAudioReady.set(true);
    }
  }

  // --- Synthesis Logic ---
  synthesize() {
    const text = this.textToConvert().trim();
    if (!text) return;

    if (!this.selectedChatId()) {
      // Auto-create session if none active
      this.service.createSession().subscribe({
        next: (chat) => {
          const id = chat.id || chat.ChatId;
          this.selectedChatId.set(id);
          this.loadChats();
          this.executeSynthesize(id, text);
        },
        error: (err) =>
          this.handleError('Server error, could not start session.'),
      });
    } else {
      this.executeSynthesize(this.selectedChatId()!, text);
    }
  }

  private executeSynthesize(chatId: string, text: string) {
    this.isLoading.set(true);
    this.isAudioReady.set(false);

    const payload = {
      chatId: chatId,
      text: text,
      voice: this.selectedVoice(),
    };

    this.service.synthesizeSpeech(payload).subscribe({
      next: (blob) => {
        this.isLoading.set(false);
        this.isAudioReady.set(true);
        this.cleanupAudio();

        const url = URL.createObjectURL(blob);
        this.audioUrl.set(url);
        //this.playAudioFromUrl(url);

        // Success message
        this.messageService.add({
          severity: 'success',
          summary: 'Generated',
          detail: 'Audio is ready to play.',
        });

        // Refresh history
        this.loadHistory(chatId);
      },
      error: (err) => {
        console.error('TTS Synthesis Error:', err);
        this.handleError(err?.error?.message || 'Failed to generate speech');
      },
    });
  }

  // --- Audio Utilities ---
  private playAudioFromUrl(url: string) {
    this.audio = new Audio(url);
    this.audio.play().catch((err) => {
      console.warn('Auto-play blocked by browser', err);
      this.messageService.add({
        severity: 'info',
        summary: 'Audio Ready',
        detail: 'Click play to listen.',
      });
    });
  }

  playAudio() {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.play();
    } else if (this.audioUrl()) {
      this.playAudioFromUrl(this.audioUrl()!);
    }
  }

  private base64ToBlobUrl(base64: string, contentType: string = 'audio/mpeg') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    return URL.createObjectURL(blob);
  }

  // --- Voice Handlers ---
  loadVoices() {
    this.service.getVoices().subscribe({
      next: (res) => {
        if (Array.isArray(res) && res.length > 0) {
          const mappedVoices = res.map((v: any) => {
            const name =
              typeof v === 'string' ? v : v.name || v.displayName || v.code;
            const found = TTS_VOICES.find((voice) => voice.name === name);
            return (
              found || {
                name,
                gender:
                  typeof v === 'object' && v.gender ? v.gender : 'Unknown',
                previewUrl: typeof v === 'object' && v.url ? v.url : '',
              }
            );
          });
          this.voices.set(mappedVoices);
        } else {
          this.voices.set([...TTS_VOICES]);
        }
      },
      error: (err) => {
        console.warn('Could not load voices from API, using defaults.', err);
        this.voices.set([...TTS_VOICES]);
      },
    });
  }

  playVoiceDemo(event: Event, voice: ITtsVoice) {
    event.stopPropagation();
    if (this.playingDemo() === voice.name) {
      this.stopDemo();
      return;
    }
    this.stopDemo();
    if (!voice.previewUrl) return;

    this.demoAudio = new Audio(voice.previewUrl);
    this.playingDemo.set(voice.name);
    this.demoAudio.onended = () => this.playingDemo.set(null);
    this.demoAudio.play().catch(() => this.playingDemo.set(null));
  }

  private stopDemo() {
    if (this.demoAudio) {
      this.demoAudio.pause();
      this.demoAudio.src = '';
      this.demoAudio = null;
    }
    this.playingDemo.set(null);
  }

  // --- General Utilities ---
  clear() {
    this.textToConvert.set('');
    this.isAudioReady.set(false);
    this.history.set([]);
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

  private handleError(detail: string) {
    this.isLoading.set(false);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail,
    });
  }
}
