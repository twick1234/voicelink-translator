import { Request, Response } from 'express';
import speechService from '../services/speechService';
import { SpeechToTextRequest } from '../types';

export class SpeechController {
  /**
   * Handle speech-to-text conversion request
   */
  async speechToText(req: Request, res: Response): Promise<void> {
    try {
      const request: SpeechToTextRequest = req.body;

      if (!request.audioData || request.audioData.trim().length === 0) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Audio data is required for speech-to-text conversion',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await speechService.speechToText(request);
      res.status(200).json(result);
    } catch (error) {
      console.error('Speech-to-text controller error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Speech-to-text conversion failed',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle audio language detection request
   */
  async detectAudioLanguage(req: Request, res: Response): Promise<void> {
    try {
      const { audioData } = req.body;

      if (!audioData || audioData.trim().length === 0) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Audio data is required for language detection',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const languageCode = await speechService.detectAudioLanguage(audioData);
      res.status(200).json({
        languageCode,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Audio language detection controller error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Audio language detection failed',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Health check endpoint for speech service
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'healthy',
      service: 'speech-to-text',
      timestamp: new Date().toISOString(),
    });
  }
}

export default new SpeechController();
