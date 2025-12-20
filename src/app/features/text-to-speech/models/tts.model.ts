export interface TtsRequest {
  chatId: string;
  text: string;
  voice: string;
}

export interface ITtsVoice {
  name: string;
  gender: string;
  previewUrl: string;
}

export interface TtsChat {
  id: string;
  name: string;
  createdAt: string;
}

export interface TtsHistoryRow {
  inputId: string;
  inputText: string;
  voiceName: string;
  createdAt: string;
  generatedAt?: string | null;
  audioData: string; // base64 bytes from backend
}
