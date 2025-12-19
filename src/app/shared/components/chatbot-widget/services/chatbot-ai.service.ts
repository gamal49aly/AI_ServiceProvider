import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, retry, throwError, timer } from 'rxjs';
import type {
  ChatMessage,
  ChatResponse,
  ChatRequest,
  ApiError,
} from '../models/chat-message-data.model.ts';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly API_URL =
    'https://ai-serviceprovider-chatbot.osc-fr1.scalingo.io/api';

  private readonly sessionId = this.generateSessionId();

  readonly conversationHistory = signal<ChatMessage[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadConversationFromStorage();
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const request: ChatRequest = {
        message,
        history: this.buildHistoryForBackend(),
        sessionId: this.sessionId,
      };

      const response = await this.callChatEndpoint(request);

      const botMessage: ChatMessage = {
        id: this.generateMessageId(),
        text: response.content.split('{')[0].trim(),
        sender: 'bot',
        timestamp: new Date(response.timestamp),
        type: response.type,
        route: response.route,
        metadata: response.metadata,
      };

      this.conversationHistory.update((history) => [...history, botMessage]);

      this.saveConversationToStorage();
      console.log(response);
      /*if (response.text.containjson { "response": { "type": "navigation", "route": "features/image-parser" } }' ) {
        this.handleNavigation(response.route);
      }*/
      if (response.type === 'navigation' && response.route) {
        this.handleNavigation(response.route);
      }

      return botMessage;
    } catch (error) {
      const errorMessage = this.handleError(error);
      this.error.set(errorMessage);

      const errorMsg: ChatMessage = {
        id: this.generateMessageId(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
        type: 'error',
      };

      this.conversationHistory.update((history) => [...history, errorMsg]);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  addUserMessage(text: string): ChatMessage {
    const userMessage: ChatMessage = {
      id: this.generateMessageId(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'message',
    };

    this.conversationHistory.update((history) => [...history, userMessage]);
    this.saveConversationToStorage();

    return userMessage;
  }

  async resetConversation(): Promise<void> {
    try {
      await this.http
        .post(`${this.API_URL}/reset`, { sessionId: this.sessionId })
        .pipe(retry(2))
        .toPromise();

      this.conversationHistory.set([]);
      this.error.set(null);

      sessionStorage.removeItem('chatbot-conversation');
    } catch (error) {
      console.error('Failed to reset conversation:', error);

      this.conversationHistory.set([]);
      sessionStorage.removeItem('chatbot-conversation');
    }
  }

  private async callChatEndpoint(request: ChatRequest): Promise<ChatResponse> {
    return new Promise((resolve, reject) => {
      this.http
        .post<ChatResponse>(`${this.API_URL}/chat`, request)
        .pipe(
          retry({
            count: 3,
            delay: (error, retryCount) => {
              const delayMs = Math.pow(2, retryCount - 1) * 1000;
              console.log(`Retry attempt ${retryCount} after ${delayMs}ms`);
              return timer(delayMs);
            },
          }),
          catchError((error) => throwError(() => error)),
        )
        .subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error),
        });
    });
  }

  private handleNavigation(route: string): void {
    setTimeout(() => {
      this.router.navigate([route]);
    }, 1500);
  }

  private handleError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Unable to connect to the server. Please check if the backend is running.';
      }

      const apiError = error.error as ApiError;
      return (
        apiError?.message || `Server error: ${error.status} ${error.statusText}`
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  private buildHistoryForBackend(): Array<{ role: string; content: string }> {
    return this.conversationHistory().map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));
  }

  private saveConversationToStorage(): void {
    try {
      const data = JSON.stringify(this.conversationHistory());
      sessionStorage.setItem('chatbot-conversation', data);
    } catch (error) {
      console.error('Failed to save conversation to storage:', error);
    }
  }

  private loadConversationFromStorage(): void {
    try {
      const data = sessionStorage.getItem('chatbot-conversation');
      if (data) {
        const messages = JSON.parse(data) as ChatMessage[];

        const parsedMessages = messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        this.conversationHistory.set(parsedMessages);
      }
    } catch (error) {
      console.error('Failed to load conversation from storage:', error);
    }
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
