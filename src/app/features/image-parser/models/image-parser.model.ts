export interface ImageParserDTO {}

export interface IParseImageRequest {
  chatId: string;
  image: File;
  jsonKeys: string;
}

export interface IParseImageResponse {
  inputId: string;
  parsedData: string;
}

/**
 * Image parser configuration
 */
export interface ImageParserConfig {
  maxFileSizeMB: number;
  allowedTypes: string[];
  apiEndpoint: string;
}
