import axios from 'axios';
import { TranslationRequest, TranslationResponse } from '../types';

export class TranslationService {
  // Using LibreTranslate - a free, open-source translation API
  // Public instance: https://libretranslate.com
  private apiUrl: string;

  constructor() {
    // Use public LibreTranslate instance (FREE!)
    this.apiUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
  }

  /**
   * Detect the language of the provided text
   * @param text - Text to detect language from
   * @returns Detected language code and confidence
   */
  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    try {
      const response = await axios.post(`${this.apiUrl}/detect`, {
        q: text,
      });

      const detections = response.data;
      if (detections && detections.length > 0) {
        return {
          language: detections[0].language,
          confidence: detections[0].confidence,
        };
      }

      // Fallback to English if detection fails
      return {
        language: 'en',
        confidence: 0.5,
      };
    } catch (error) {
      console.error('Language detection error:', error);
      // Fallback to English
      return {
        language: 'en',
        confidence: 0.5,
      };
    }
  }

  /**
   * Translate text to target language
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

      // Perform translation using LibreTranslate
      const response = await axios.post(`${this.apiUrl}/translate`, {
        q: text,
        source: detectedLang,
        target: targetLanguage,
        format: 'text',
      });

      return {
        originalText: text,
        translatedText: response.data.translatedText,
        detectedLanguage: detectedLang,
        confidence,
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
