import { SpeechToTextRequest, SpeechToTextResponse } from '../types';

export class SpeechService {
  // Speech recognition is handled by the Flutter mobile app using device capabilities
  // This service is kept for API compatibility but delegates to the mobile app
  constructor() {
    // No initialization needed - mobile app handles speech recognition
  }

  /**
   * Speech-to-text is handled directly on the mobile device
   * This endpoint is kept for API compatibility
   * @param request - Speech-to-text request with audio data and configuration
   * @returns Placeholder response - actual speech recognition happens on device
   */
  async speechToText(request: SpeechToTextRequest): Promise<SpeechToTextResponse> {
    // Speech recognition is handled by Flutter's speech_to_text package on the device
    // This provides better performance, offline capability, and no API costs!

    return {
      transcript: 'Speech recognition is handled on the mobile device',
      confidence: 1.0,
      detectedLanguage: 'en-US',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Audio language detection is handled on the mobile device
   * @param audioData - Base64 encoded audio data
   * @returns Detected language code
   */
  async detectAudioLanguage(audioData: string): Promise<string> {
    // Language detection happens on the device using Flutter's speech_to_text
    return 'en-US'; // Default fallback
  }
}

export default new SpeechService();
