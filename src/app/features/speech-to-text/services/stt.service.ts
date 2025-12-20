import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ISpeechToTextResponse,
  SttChat,
  SttHistoryRow,
} from '../models/stt.model';
import { ChatService } from '../../../core/services/chat.service';

@Injectable({
  providedIn: 'root',
})
export class SttService {
  private readonly http = inject(HttpClient);
  private readonly chatService = inject(ChatService);
  private readonly apiUrl = 'https://localhost:7049/api/SpeechToText';

  createSession(): Observable<any> {
    return this.chatService.createSession('STT');
  }

  convertSpeechToText(
    chatId: string,
    audioFile: File
  ): Observable<ISpeechToTextResponse> {
    const formData = new FormData();
    formData.append('ChatId', chatId);
    formData.append('AudioFile', audioFile);

    return this.http.post<ISpeechToTextResponse>(
      `${this.apiUrl}/transcribe`,
      formData
    );
  }

  getChats(): Observable<SttChat[]> {
    return this.http.get<SttChat[]>(`${this.apiUrl}/chats`);
  }

  getHistory(chatId: string): Observable<SttHistoryRow[]> {
    return this.http.get<SttHistoryRow[]>(`${this.apiUrl}/history/${chatId}`);
  }
}
