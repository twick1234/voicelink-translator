import axios from 'axios';
import { franc } from 'franc-min';
import { TranslationRequest, TranslationResponse } from '../types';

// Language code mapping from franc (ISO 639-3) to ISO 639-1
const langCodeMap: Record<string, string> = {
  'eng': 'en', 'spa': 'es', 'fra': 'fr', 'deu': 'de', 'ita': 'it',
  'por': 'pt', 'rus': 'ru', 'jpn': 'ja', 'kor': 'ko', 'zho': 'zh',
  'ara': 'ar', 'hin': 'hi', 'ben': 'bn', 'urd': 'ur', 'tur': 'tr',
  'vie': 'vi', 'tha': 'th', 'pol': 'pl', 'nld': 'nl', 'swe': 'sv',
};

export class TranslationService {
  // Using MyMemory - a free translation API that requires NO API key!
  // Free tier: Generous limits, no registration required
  private apiUrl: string;

  constructor() {
    // MyMemory free translation API
    this.apiUrl = 'https://api.mymemory.translated.net';
  }

  /**
   * Detect the language of the provided text using franc (offline, free!)
   * @param text - Text to detect language from
   * @returns Detected language code and confidence
   */
  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    try {
      // Common English words for quick detection
      const commonEnglishWords = [
        'hello', 'world', 'good', 'morning', 'thank', 'you', 'please',
        'how', 'are', 'what', 'when', 'where', 'why', 'the', 'is', 'and'
      ];

      const lowerText = text.toLowerCase();
      const hasEnglishWords = commonEnglishWords.some(word => lowerText.includes(word));

      // If text contains common English words, assume English
      if (hasEnglishWords) {
        return { language: 'en', confidence: 0.9 };
      }

      // For very short text (< 20 chars), default to English
      if (text.length < 20) {
        return { language: 'en', confidence: 0.6 };
      }

      const detected = franc(text, { minLength: 20 });

      if (detected === 'und') {
        // Undetermined language - default to English
        return { language: 'en', confidence: 0.5 };
      }

      // Convert ISO 639-3 to ISO 639-1
      const language = langCodeMap[detected] || 'en';

      // Higher confidence for longer text
      const confidence = text.length > 50 ? 0.9 : 0.7;

      return { language, confidence };
    } catch (error) {
      console.error('Language detection error:', error);
      return { language: 'en', confidence: 0.5 };
    }
  }

  /**
   * Translate text to target language using MyMemory API (FREE!)
   * @param request - Translation request with text and optional source/target languages
   * @returns Translation response with original, translated text and metadata
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, targetLanguage = 'en', sourceLanguage } = request;

    try {
      // Detect source language if not provided
      let detectedLang: string;
      let confidence = 1.0;

      if (!sourceLanguage) {
        const detection = await this.detectLanguage(text);
        detectedLang = detection.language;
        confidence = detection.confidence;
      } else {
        detectedLang = sourceLanguage;
      }

      // Skip translation if source and target are the same
      if (detectedLang === targetLanguage) {
        return {
          originalText: text,
          translatedText: text,
          detectedLanguage: detectedLang,
          confidence,
          timestamp: new Date().toISOString(),
        };
      }

      // Translate using MyMemory API
      const langPair = `${detectedLang}|${targetLanguage}`;
      const response = await axios.get(`${this.apiUrl}/get`, {
        params: {
          q: text,
          langpair: langPair,
        },
      });

      if (response.data.responseStatus !== 200) {
        throw new Error(`Translation API error: ${response.data.responseDetails}`);
      }

      return {
        originalText: text,
        translatedText: response.data.responseData.translatedText,
        detectedLanguage: detectedLang,
        confidence: response.data.responseData.match || confidence,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Failed to translate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get list of supported languages
   * @returns Array of supported language codes and names
   */
  async getSupportedLanguages(): Promise<Array<{ code: string; name: string }>> {
    try {
      const response = await axios.get(`${this.apiUrl}/languages`);

      return response.data.map((lang: any) => ({
        code: lang.code,
        name: lang.name,
      }));
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      // Return common languages as fallback
      return [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh', name: 'Chinese' },
      ];
    }
  }

  /**
   * Translate multiple texts in batch
   * @param texts - Array of texts to translate
   * @param targetLanguage - Target language code
   * @returns Array of translation responses
   */
  async batchTranslate(
    texts: string[],
    targetLanguage: string = 'en'
  ): Promise<TranslationResponse[]> {
    try {
      const translations = await Promise.all(
        texts.map(text => this.translate({ text, targetLanguage }))
      );
      return translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      throw new Error(`Failed to batch translate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new TranslationService();
