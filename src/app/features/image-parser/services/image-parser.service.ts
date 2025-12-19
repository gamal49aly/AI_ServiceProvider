import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IParseImageResponse } from '../models/image-parser.model';
import { ChatService } from '../../../core/services/chat.service';

@Injectable({
  providedIn: 'root',
})
export class ImageParserService {
  private readonly http = inject(HttpClient);
  private readonly chatService = inject(ChatService);
  private readonly apiUrl = 'https://localhost:7049/api';

  /**
   * 1. Create a generic chat session for the parser
   */
  createSession(): Observable<any> {
    return this.chatService.createSession('Parser');
  }

  /**
   * 2. Upload image and get text back
   */
  parseImage(
    chatId: string,
    image: File,
    jsonKeys: string
  ): Observable<IParseImageResponse> {
    const formData = new FormData();
    formData.append('ChatId', chatId);
    formData.append('Image', image);
    formData.append('JsonKeys', jsonKeys || 'All Text');

    return this.http.post<IParseImageResponse>(
      `${this.apiUrl}/ImageParser/parse`,
      formData
    );
  }
}
