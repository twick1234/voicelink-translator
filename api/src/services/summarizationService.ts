import OpenAI from 'openai';
import { SummarizationRequest, SummarizationResponse, ConversationMessage } from '../types';

export class SummarizationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Summarize a conversation using OpenAI GPT-4
   * @param request - Summarization request with conversation messages
   * @returns Summary with key points and metadata
   */
  async summarizeConversation(request: SummarizationRequest): Promise<SummarizationResponse> {
    const { messages, format = 'brief' } = request;

    try {
      // Format conversation for summarization
      const conversationText = this.formatConversation(messages);

      // Extract metadata
      const languagesDetected = this.extractLanguages(messages);
      const duration = this.calculateDuration(messages);
      const participantCount = this.countParticipants(messages);

      // Create prompt based on format
      const prompt = this.createPrompt(conversationText, format);

      // Call OpenAI API for summarization
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes conversations clearly and concisely. Extract the most important information and key points.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: format === 'brief' ? 500 : 1500,
      });

      const summary = completion.choices[0]?.message?.content || 'Unable to generate summary';

      // Extract key points from summary
      const keyPoints = this.extractKeyPoints(summary);

      return {
        summary,
        keyPoints,
        participantCount,
        duration,
        languagesDetected,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Summarization error:', error);
      throw new Error(`Failed to summarize conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Format conversation messages into readable text
   * @param messages - Array of conversation messages
   * @returns Formatted conversation string
   */
  private formatConversation(messages: ConversationMessage[]): string {
    return messages
      .map(msg => {
        const role = msg.speaker === 'listener' ? 'Listener' : 'Speaker';
        const langInfo = msg.detectedLanguage !== 'en' ? ` [${msg.detectedLanguage}]` : '';
        return `${role}${langInfo}: ${msg.originalText}\nTranslation: ${msg.translatedText}`;
      })
      .join('\n\n');
  }

  /**
   * Create summarization prompt based on format
   * @param conversationText - Formatted conversation text
   * @param format - Summary format (brief or detailed)
   * @returns Prompt string for OpenAI
   */
  private createPrompt(conversationText: string, format: 'brief' | 'detailed'): string {
    const basePrompt = `Please summarize the following conversation:\n\n${conversationText}`;

    if (format === 'brief') {
      return `${basePrompt}\n\nProvide a brief summary in 2-3 sentences highlighting the main topic and outcome.`;
    }

    return `${basePrompt}\n\nProvide a detailed summary including:
1. Main topics discussed
2. Key points and decisions
3. Action items (if any)
4. Overall tone and context`;
  }

  /**
   * Extract key points from summary text
   * @param summary - Summary text
   * @returns Array of key points
   */
  private extractKeyPoints(summary: string): string[] {
    const lines = summary.split('\n').filter(line => line.trim().length > 0);

    // Look for bullet points or numbered lists
    const keyPoints = lines
      .filter(line => /^[-•*]\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim()))
      .map(line => line.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, '').trim());

    // If no bullet points found, split by sentences and take first 3-5
    if (keyPoints.length === 0) {
      const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 20);
      return sentences.slice(0, Math.min(5, sentences.length)).map(s => s.trim());
    }

    return keyPoints;
  }

  /**
   * Extract unique languages from conversation
   * @param messages - Array of conversation messages
   * @returns Array of unique language codes
   */
  private extractLanguages(messages: ConversationMessage[]): string[] {
    const languages = new Set(messages.map(msg => msg.detectedLanguage));
    return Array.from(languages);
  }

  /**
   * Calculate conversation duration
   * @param messages - Array of conversation messages
   * @returns Duration string
   */
  private calculateDuration(messages: ConversationMessage[]): string {
    if (messages.length === 0) return '0 minutes';

    const startTime = new Date(messages[0].timestamp);
    const endTime = new Date(messages[messages.length - 1].timestamp);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);

    if (durationMinutes < 1) return '< 1 minute';
    if (durationMinutes === 1) return '1 minute';
    return `${durationMinutes} minutes`;
  }

  /**
   * Count unique participants in conversation
   * @param messages - Array of conversation messages
   * @returns Number of participants
   */
  private countParticipants(messages: ConversationMessage[]): number {
    const participants = new Set(messages.map(msg => msg.speaker));
    return participants.size;
  }
}

export default new SummarizationService();
