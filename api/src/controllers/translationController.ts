import { Request, Response } from 'express';
import translationService from '../services/translationService';
import { TranslationRequest } from '../types';

export class TranslationController {
  /**
   * Handle translation request
   */
  async translate(req: Request, res: Response): Promise<void> {
    try {
      const request: TranslationRequest = req.body;

      if (!request.text || request.text.trim().length === 0) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Text is required for translation',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await translationService.translate(request);
      res.status(200).json(result);
    } catch (error) {
      console.error('Translation controller error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Translation failed',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle language detection request
   */
  async detectLanguage(req: Request, res: Response): Promise<void> {
    try {
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Text is required for language detection',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await translationService.detectLanguage(text);
      res.status(200).json({
        ...result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Language detection controller error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Language detection failed',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(req: Request, res: Response): Promise<void> {
    try {
      const languages = await translationService.getSupportedLanguages();
      res.status(200).json({
        languages,
        count: languages.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get supported languages error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to fetch languages',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle batch translation request
   */
  async batchTranslate(req: Request, res: Response): Promise<void> {
    try {
      const { texts, targetLanguage = 'en' } = req.body;

      if (!Array.isArray(texts) || texts.length === 0) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'An array of texts is required for batch translation',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (texts.length > 100) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Maximum 100 texts allowed per batch request',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const results = await translationService.batchTranslate(texts, targetLanguage);
      res.status(200).json({
        results,
        count: results.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Batch translation controller error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Batch translation failed',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export default new TranslationController();
