import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7049/api';

  /**
   * @param prefix The prefix for the session name (e.g., 'TTS', 'STT', 'Parser').
   */
  createSession(prefix: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Chat`, {
      name: `${prefix} Session ${new Date().toLocaleTimeString()}`,
    });
  }
}
