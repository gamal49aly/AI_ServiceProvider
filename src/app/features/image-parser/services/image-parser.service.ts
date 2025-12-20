import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ParseImageResponseDto,
  ImageParserChat,
  ImageParserHistoryRow,
} from '../models/image-parser.model';
import { ChatService } from '../../../core/services/chat.service';

@Injectable({
  providedIn: 'root',
})
export class ImageParserService {
  private readonly http = inject(HttpClient);
  private readonly chatService = inject(ChatService);
  private readonly apiUrl = 'https://localhost:7049/api/ImageParser';

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
  ): Observable<ParseImageResponseDto> {
    const formData = new FormData();
    formData.append('ChatId', chatId);
    formData.append('Image', image);
    formData.append('JsonKeys', jsonKeys || 'All Text');

    return this.http.post<ParseImageResponseDto>(
      `${this.apiUrl}/parse`,
      formData
    );
  }

  /**
   * 3. Get all chat sessions for the current user
   */
  getChats(): Observable<ImageParserChat[]> {
    return this.http.get<ImageParserChat[]>(`${this.apiUrl}/chats`);
  }

  /**
   * 4. Get history for a specific chat
   */
  getHistory(chatId: string): Observable<ImageParserHistoryRow[]> {
    return this.http.get<ImageParserHistoryRow[]>(
      `${this.apiUrl}/history/${chatId}`
    );
  }
}
