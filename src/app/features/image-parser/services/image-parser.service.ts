import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageParserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7049/api';

  /**
   * 1. Create a generic chat session for the parser
   */
  createSession(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Chat`, { name: `Parser Session ${new Date().toLocaleTimeString()}` });
  }

  /**
   * 2. Upload image and get text back
   */
  parseImage(chatId: string, file: File, jsonKeys: string): Observable<any> {
    const formData = new FormData();
    formData.append('ChatId', chatId);
    formData.append('Image', file);
    // Keys user wants to extract (e.g., "Name, Date, Total")
    formData.append('JsonKeys', jsonKeys || 'All Text'); 

    return this.http.post(`${this.apiUrl}/ImageParser/parse`, formData);
  }
}