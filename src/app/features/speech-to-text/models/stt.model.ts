export interface ISpeechToTextRequest {
  chatId: string;
  audioFile: File;
}

export interface ISpeechToTextResponse {
  inputId: string;
  transcribedText: string;
}

export interface SttChat {
  id: string;
  name: string;
  createdAt: string;
}

export interface SttHistoryRow {
  inputId: string;
  originalFileName: string;
  audioData: string; // Base64 string from byte[] in JSON
  uploadedAt: string;
  transcribedText: string | null;
  generatedAt: string | null;
}

export interface SttConfig {
  maxFileSizeMB: number;
  allowedTypes: string[];
  apiEndpoint: string;
}
