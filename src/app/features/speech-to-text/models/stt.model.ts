export interface ISpeechToTextRequest {
  chatId: string;
  audioFile: File;
}

export interface ISpeechToTextResponse {
  inputId: string;
  transcribedText: string;
}

export interface SttConfig {
  maxFileSizeMB: number;
  allowedTypes: string[];
  apiEndpoint: string;
}
