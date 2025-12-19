export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'message' | 'navigation' | 'error';
  route?: string;
  metadata?: NavigationMetadata;
}

export interface NavigationMetadata {
  serviceName?: string;
  action?: string;
  route: string;
}

export interface ChatResponse {
  type: 'message' | 'navigation';
  content: string;
  route?: string;
  metadata?: NavigationMetadata;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
  sessionId?: string;
}

export interface ApiError {
  error: string;
  message: string;
}
