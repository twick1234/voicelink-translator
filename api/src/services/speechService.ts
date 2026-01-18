import speech from '@google-cloud/speech';
import { SpeechToTextRequest, SpeechToTextResponse } from '../types';

export class SpeechService {
  private client: speech.v1.SpeechClient;

  constructor() {
    this.client = new speech.v1.SpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  /**
   * Convert audio to text using Google Speech-to-Text API
   * @param request - Speech-to-text request with audio data and configuration
   * @returns Transcription result with detected language and confidence
   */
  async speechToText(request: SpeechToTextRequest): Promise<SpeechToTextResponse> {
    const {
      audioData,
      encoding = 'LINEAR16',
      sampleRateHertz = 16000,
      languageCode = 'en-US',
    } = request;

    try {
      const audio = {
        content: audioData,
      };

      const config = {
        encoding: encoding as any,
        sampleRateHertz,
        languageCode,
        enableAutomaticPunctuation: true,
        model: 'default',
        useEnhanced: true,
        // Enable language detection for multilingual support
        alternativeLanguageCodes: [
          'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR',
          'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA',
        ],
      };

      const [response] = await this.client.recognize({
        audio,
        config,
      });

      const transcription = response.results
        ?.map(result => result.alternatives?.[0]?.transcript)
        .join(' ') || '';

      const confidence = response.results?.[0]?.alternatives?.[0]?.confidence || 0;

      // Extract detected language from response
      const detectedLang = response.results?.[0]?.languageCode || languageCode;

      return {
        transcript: transcription,
        confidence,
        detectedLanguage: detectedLang,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw new Error(`Failed to convert speech to text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stream audio for real-time transcription
   * @param audioStream - Readable stream of audio data
   * @param onTranscript - Callback function for transcript results
   * @param languageCode - Language code for transcription
   */
  async streamingRecognize(
    audioStream: NodeJS.ReadableStream,
    onTranscript: (transcript: string, isFinal: boolean) => void,
    languageCode: string = 'en-US'
  ): Promise<void> {
    const recognizeStream = this.client
      .streamingRecognize({
        config: {
          encoding: 'LINEAR16' as any,
          sampleRateHertz: 16000,
          languageCode,
          enableAutomaticPunctuation: true,
          interimResults: true,
          model: 'default',
        },
        interimResults: true,
      })
      .on('error', (error) => {
        console.error('Streaming error:', error);
        throw error;
      })
      .on('data', (data) => {
        const result = data.results[0];
        if (result && result.alternatives && result.alternatives.length > 0) {
          const transcript = result.alternatives[0].transcript;
          const isFinal = result.isFinal;
          onTranscript(transcript || '', isFinal);
        }
      });

    audioStream.pipe(recognizeStream);
  }

  /**
   * Detect language from audio without transcription
   * @param audioData - Base64 encoded audio data
   * @returns Detected language code
   */
  async detectAudioLanguage(audioData: string): Promise<string> {
    try {
      const audio = {
        content: audioData,
      };

      const config = {
        encoding: 'LINEAR16' as any,
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        alternativeLanguageCodes: [
          'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR',
          'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA',
        ],
      };

      const [response] = await this.client.recognize({
        audio,
        config,
      });

      return response.results?.[0]?.languageCode || 'en-US';
    } catch (error) {
      console.error('Audio language detection error:', error);
      return 'en-US'; // Fallback to English
    }
  }
}

export default new SpeechService();
