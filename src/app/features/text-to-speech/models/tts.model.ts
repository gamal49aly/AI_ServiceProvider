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
