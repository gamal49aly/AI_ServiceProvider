import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatMessageData } from './models/chat-message-data.model';

@Component({
  selector: 'app-chatbot-widget',
  imports: [CommonModule, ChatMessageComponent],
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotWidgetComponent {
  // State management using signals
  isOpen = signal(false);
  isTyping = signal(false);
  messages = signal<ChatMessageData[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  currentMessage = signal('');

  // Computed property for unread messages count
  unreadCount = computed(() => {
    if (this.isOpen()) return 0;
    return this.messages().filter((m) => m.sender === 'bot').length;
  });

  toggleChat() {
    this.isOpen.update((value) => !value);
  }

  sendMessage() {
    const messageText = this.currentMessage().trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    this.messages.update((msgs) => [...msgs, userMessage]);
    this.currentMessage.set('');

    // Simulate bot typing
    this.isTyping.set(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        text: this.generateBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date(),
      };

      this.messages.update((msgs) => [...msgs, botMessage]);
      this.isTyping.set(false);

      // Auto-scroll to bottom
      setTimeout(() => this.scrollToBottom(), 100);
    }, 1500);

    // Auto-scroll to bottom
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private generateBotResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    return 'Hello! How can I assist you today?';
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
