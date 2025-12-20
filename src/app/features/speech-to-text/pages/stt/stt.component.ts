import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SttService } from '../../services/stt.service';
import { MessageService } from 'primeng/api';
import {
  ISpeechToTextResponse,
  SttChat,
  SttHistoryRow,
} from '../../models/stt.model';

// PrimeNG Modules
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

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
    DrawerModule,
    DividerModule,
    BadgeModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './stt.component.html',
  styleUrl: './stt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SttComponent implements OnInit {
  private readonly service = inject(SttService);
  private readonly messageService = inject(MessageService);

  // ==========================================
  // State & Properties
  // ==========================================
  uploadedFile = signal<File | null>(null);
  audioUrl = signal<string | null>(null);
  isLoading = signal(false);
  convertedText = signal<ISpeechToTextResponse | null>(null);

  // Session & History State
  chats = signal<SttChat[]>([]);
  history = signal<SttHistoryRow[]>([]);
  selectedChatId = signal<string | null>(null);
  showHistoryDrawer = signal(false);
  isLoadingHistory = signal(false);

  activeChat = computed(() => {
    const id = this.selectedChatId();
    if (!id) return null;
    return this.chats().find((c) => c.id === id) || null;
  });

  // ==========================================
  // Lifecycle Hooks
  // ==========================================
  ngOnInit(): void {
    this.loadChats();
  }

  // ==========================================
  // Session & Chat Management
  // ==========================================
  loadChats(): void {
    this.service.getChats().subscribe({
      next: (chats) => this.chats.set(chats),
      error: (err) => console.error('Error loading chats:', err),
    });
  }

  selectChat(chatId: string): void {
    this.selectedChatId.set(chatId);
    this.showHistoryDrawer.set(false);
    this.loadHistory(chatId);
  }

  createNewSession(): void {
    this.service.createSession().subscribe({
      next: (chat) => {
        const chatId = chat?.id || chat?.Id || chat?.ChatId;
        if (chatId) {
          this.selectedChatId.set(chatId);
          this.loadChats(); // Refresh list to show new session
          this.history.set([]);
          this.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'New Session',
            detail: 'Started a fresh speech-to-text session.',
          });
        }
      },
      error: (err) => {
        console.error('Error creating session:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Session Error',
          detail: 'Failed to create a new session.',
        });
      },
    });
  }

  // ==========================================
  // History Management
  // ==========================================
  loadHistory(chatId: string): void {
    this.isLoadingHistory.set(true);
    this.service.getHistory(chatId).subscribe({
      next: (history) => {
        this.history.set(history);
        this.isLoadingHistory.set(false);
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.isLoadingHistory.set(false);
      },
    });
  }

  viewHistoryRecord(record: SttHistoryRow): void {
    // Populate UI with historical record
    if (record.audioData) {
      // Convert base64 bytes to blob URL
      const url = this.base64ToBlobUrl(record.audioData);
      this.audioUrl.set(url);
    } else {
      this.audioUrl.set(null);
    }

    this.convertedText.set({
      inputId: record.inputId,
      transcribedText: record.transcribedText || 'No transcription available.',
    });
  }

  private base64ToBlobUrl(
    base64: string,
    contentType: string = 'audio/mpeg'
  ): string {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error('Error converting audio data:', e);
      return '';
    }
  }

  // ==========================================
  // File & UI Event Handlers
  // ==========================================
  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFile.set(file);
      // Create URL for audio player
      this.audioUrl.set(URL.createObjectURL(file));
      this.convertedText.set(null);
    }
  }

  // ==========================================
  // Audio Processing Logic
  // ==========================================
  processAudio() {
    const file = this.uploadedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.convertedText.set(null);

    // Ensure we have a session
    if (this.selectedChatId()) {
      this.executeTranscribe(this.selectedChatId()!, file);
    } else {
      this.service.createSession().subscribe({
        next: (chat) => {
          const chatId = chat?.id || chat?.Id || chat?.ChatId;
          if (!chatId) {
            this.handleSessionError();
            return;
          }
          this.selectedChatId.set(chatId);
          this.loadChats(); // Refresh list
          this.executeTranscribe(chatId, file);
        },
        error: (err) => {
          console.error('Session Error:', err);
          this.handleErrorWithMockData();
        },
      });
    }
  }

  private executeTranscribe(chatId: string, file: File) {
    this.service.convertSpeechToText(chatId, file).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.convertedText.set(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Audio converted successfully!',
        });
        // Refresh history
        this.loadHistory(chatId);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.handleErrorWithMockData();
      },
    });
  }

  private handleSessionError(): void {
    console.error('No Chat ID found in session response');
    this.isLoading.set(false);
    this.messageService.add({
      severity: 'error',
      summary: 'Session Error',
      detail: 'Could not create a valid session.',
    });
  }

  // ==========================================
  // Actions & Utilities
  // ==========================================
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
    this.selectedChatId.set(null);
    this.history.set([]);
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
