import { SummarizationRequest, SummarizationResponse, ConversationMessage } from '../types';

export class SummarizationService {
  // Using simple extractive summarization - no API needed!
  constructor() {
    // No API initialization needed for free summarization
  }

  /**
   * Summarize a conversation using simple extractive summarization (FREE!)
   * @param request - Summarization request with conversation messages
   * @returns Summary with key points and metadata
   */
  async summarizeConversation(request: SummarizationRequest): Promise<SummarizationResponse> {
    const { messages, format = 'brief' } = request;

    try {
      // Extract metadata
      const languagesDetected = this.extractLanguages(messages);
      const duration = this.calculateDuration(messages);
      const participantCount = this.countParticipants(messages);

      // Create simple extractive summary
      const summary = this.createSimpleSummary(messages, format);

      // Extract key points
      const keyPoints = this.extractKeyPointsFromMessages(messages);

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
   * Create a simple summary without AI
   * @param messages - Conversation messages
   * @param format - Summary format
   * @returns Summary text
   */
  private createSimpleSummary(messages: ConversationMessage[], format: 'brief' | 'detailed'): string {
    if (messages.length === 0) {
      return 'No conversation recorded.';
    }

    const totalMessages = messages.length;
    const languages = this.extractLanguages(messages);
    const duration = this.calculateDuration(messages);

    if (format === 'brief') {
      return `Conversation with ${totalMessages} message${totalMessages > 1 ? 's' : ''} over ${duration}. Languages detected: ${languages.join(', ')}.`;
    }

    // Detailed summary
    let summary = `Conversation Summary:\n\n`;
    summary += `Total Messages: ${totalMessages}\n`;
    summary += `Duration: ${duration}\n`;
    summary += `Languages: ${languages.join(', ')}\n`;
    summary += `Participants: ${this.countParticipants(messages)}\n\n`;

    // Include first and last few messages
    const previewCount = Math.min(3, messages.length);
    summary += `First messages:\n`;
    for (let i = 0; i < previewCount; i++) {
      const msg = messages[i];
      const role = msg.speaker === 'listener' ? 'Listener' : 'Speaker';
      summary += `${role}: ${msg.translatedText}\n`;
    }

    if (messages.length > 6) {
      summary += `\n... (${messages.length - 6} more messages) ...\n\n`;
    }

    if (messages.length > 3) {
      summary += `\nLast messages:\n`;
      for (let i = Math.max(messages.length - 3, previewCount); i < messages.length; i++) {
        const msg = messages[i];
        const role = msg.speaker === 'listener' ? 'Listener' : 'Speaker';
        summary += `${role}: ${msg.translatedText}\n`;
      }
    }

    return summary;
  }

  /**
   * Extract key points from messages
   * @param messages - Conversation messages
   * @returns Array of key points
   */
  private extractKeyPointsFromMessages(messages: ConversationMessage[]): string[] {
    const keyPoints: string[] = [];

    // Extract unique topics/themes (simple keyword-based)
    const allText = messages.map(m => m.translatedText.toLowerCase()).join(' ');

    // Common question words indicate important points
    if (allText.includes('when')) keyPoints.push('Discussed timing/schedule');
    if (allText.includes('where')) keyPoints.push('Discussed location');
    if (allText.includes('how')) keyPoints.push('Discussed methods/process');
    if (allText.includes('why')) keyPoints.push('Discussed reasons/motivation');
    if (allText.includes('what')) keyPoints.push('Discussed objectives/items');

    // If no key points found, use message count
    if (keyPoints.length === 0) {
      keyPoints.push(`${messages.length} messages exchanged`);
      keyPoints.push(`Multiple languages used`);
    }

    return keyPoints.slice(0, 5); // Max 5 key points
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
