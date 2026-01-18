import { Translate } from '@google-cloud/translate/build/src/v2';
import { TranslationRequest, TranslationResponse } from '../types';

export class TranslationService {
  private translateClient: Translate;

  constructor() {
    this.translateClient = new Translate({
      key: process.env.GOOGLE_CLOUD_API_KEY,
    });
  }

  /**
   * Detect the language of the provided text
   * @param text - Text to detect language from
   * @returns Detected language code and confidence
   */
  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    try {
      const [detection] = await this.translateClient.detect(text);

      if (Array.isArray(detection)) {
        return {
          language: detection[0].language,
          confidence: detection[0].confidence || 0.95,
        };
      }

      return {
        language: detection.language,
        confidence: detection.confidence || 0.95,
      };
    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error(`Failed to detect language: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

      // Perform translation
      const [translation] = await this.translateClient.translate(text, {
        from: detectedLang,
        to: targetLanguage,
      });

      return {
        originalText: text,
        translatedText: translation,
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
      const [languages] = await this.translateClient.getLanguages();
      return languages.map(lang => ({
        code: lang.code,
        name: lang.name,
      }));
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      throw new Error(`Failed to fetch supported languages: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
