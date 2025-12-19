import {
  Component,
  signal,
  computed,
  inject,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatMessage } from './models/chat-message-data.model';
import { Router } from '@angular/router';
import { AiService } from './services/chatbot-ai.service';
@Component({
  selector: 'app-chatbot-widget',
  imports: [CommonModule, ChatMessageComponent],
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotWidgetComponent {
  private readonly aiService = inject(AiService);
  private readonly router = inject(Router);

  
  isOpen = signal(false);
  currentMessage = signal('');

  
  readonly messages = this.aiService.conversationHistory;

  readonly isTyping = this.aiService.isLoading;
  readonly error = this.aiService.error;

  
  unreadCount = computed(() => {
    if (this.isOpen()) return 0;
    return this.messages().filter((m) => m.sender === 'bot').length;
  });

  
  constructor() {
    effect(() => {
      if (this.messages().length === 0) {
        
        const welcomeMessage: ChatMessage = {
          id: 'welcome-1',
          text: 'Hello! How can I help you today? I can assist you with Our services.',
          sender: 'bot',
          timestamp: new Date(),
          type: 'message',
        };

        
        this.aiService.conversationHistory.set([welcomeMessage]);
      }
    });
  }

  toggleChat() {
    this.isOpen.update((value) => !value);
  }

  async sendMessage() {
    const messageText = this.currentMessage().trim();
    if (!messageText || this.isTyping()) return;

    
    this.currentMessage.set('');

    
    this.aiService.addUserMessage(messageText);

    
    setTimeout(() => this.scrollToBottom(), 100);

    try {
      
      await this.aiService.sendMessage(messageText);

      
      setTimeout(() => this.scrollToBottom(), 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      
    }
  }

  async clearConversation() {
    if (confirm('Are you sure you want to clear the conversation?')) {
      await this.aiService.resetConversation();

      
      const welcomeMessage: ChatMessage = {
        id: 'welcome-' + Date.now(),
        text: 'Conversation cleared. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'message',
      };

      this.aiService.conversationHistory.set([welcomeMessage]);
    }
  }

  dismissError() {
    this.aiService.error.set(null);
  }

  private scrollToBottom() {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  handleEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey && !this.isTyping()) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }
}
