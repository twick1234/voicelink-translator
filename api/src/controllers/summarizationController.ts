import { Request, Response } from 'express';
import summarizationService from '../services/summarizationService';
import { SummarizationRequest } from '../types';

export class SummarizationController {
  /**
   * Handle conversation summarization request
   */
  async summarizeConversation(req: Request, res: Response): Promise<void> {
    try {
      const request: SummarizationRequest = req.body;

      if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Messages array is required for summarization',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (request.messages.length > 1000) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Maximum 1000 messages allowed per summarization request',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await summarizationService.summarizeConversation(request);
      res.status(200).json(result);
    } catch (error) {
      console.error('Summarization controller error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Summarization failed',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Health check endpoint for summarization service
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'healthy',
      service: 'summarization',
      timestamp: new Date().toISOString(),
    });
  }
}

export default new SummarizationController();
