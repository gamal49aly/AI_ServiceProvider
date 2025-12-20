import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TtsChat, TtsHistoryRow, TtsRequest } from '../models/tts.model';
import { ChatService } from '../../../core/services/chat.service';

@Injectable({
  providedIn: 'root',
})
export class TtsService {
  private readonly http = inject(HttpClient);
  private readonly chatService = inject(ChatService);
  private readonly apiUrl = 'https://localhost:7049/api/TextToSpeech';

  createSession(): Observable<any> {
    return this.chatService.createSession('TTS');
  }

  /**
   * Returns a Blobs which can be converted to a URL for playback.
   */
  synthesizeSpeech(request: TtsRequest): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/synthesize`, request, {
      responseType: 'blob',
    });
  }

  getVoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/voices`);
  }

  getChats(): Observable<TtsChat[]> {
    return this.http.get<TtsChat[]>(`${this.apiUrl}/chats`);
  }

  getHistory(chatId: string): Observable<TtsHistoryRow[]> {
    return this.http.get<TtsHistoryRow[]>(`${this.apiUrl}/history/${chatId}`);
  }
}
