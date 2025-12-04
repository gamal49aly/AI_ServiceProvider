export interface ChatMessageData {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
