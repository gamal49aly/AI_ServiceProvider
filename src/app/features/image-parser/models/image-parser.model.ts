export interface ParseImageRequestDto {
  chatId: string;
  image: File;
  jsonKeys: string;
}

export interface ParseImageResponseDto {
  inputId: string;
  parsedData: string;
}

export interface ImageParserChat {
  id: string;
  name: string;
  createdAt: string;
}

export interface ImageParserHistoryRow {
  inputId: string;
  imageUrl: string;
  jsonSchema?: string;
  uploadedAt: string;
  parsedData?: string;
  generatedAt?: string;
}

/**
 * Image parser configuration
 */
export interface ImageParserConfig {
  maxFileSizeMB: number;
  allowedTypes: string[];
  apiEndpoint: string;
}
