export interface TranslationRequest {
  text: string;
  targetLanguage?: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  confidence: number;
  timestamp: string;
}

export interface SpeechToTextRequest {
  audioData: string; // Base64 encoded audio
  encoding?: string;
  sampleRateHertz?: number;
  languageCode?: string;
}

export interface SpeechToTextResponse {
  transcript: string;
  confidence: number;
  detectedLanguage: string;
  timestamp: string;
}

export interface ConversationMessage {
  id: string;
  speaker: 'listener' | 'speaker';
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  timestamp: string;
  confidence: number;
}

export interface SummarizationRequest {
  messages: ConversationMessage[];
  format?: 'brief' | 'detailed';
}

export interface SummarizationResponse {
  summary: string;
  keyPoints: string[];
  participantCount: number;
  duration: string;
  languagesDetected: string[];
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
