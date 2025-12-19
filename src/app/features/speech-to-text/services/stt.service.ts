import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISpeechToTextResponse } from '../models/stt.model';

@Injectable({
  providedIn: 'root',
})
export class SttService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7049/api';

  createSession(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Chat`, {
      name: `STT Session ${new Date().toLocaleTimeString()}`,
    });
  }

  convertSpeechToText(
    chatId: string,
    audioFile: File
  ): Observable<ISpeechToTextResponse> {
    const formData = new FormData();
    formData.append('ChatId', chatId);
    formData.append('AudioFile', audioFile);

    return this.http.post<ISpeechToTextResponse>(
      `${this.apiUrl}/SpeechToText/transcribe`,
      formData
    );
  }
}
