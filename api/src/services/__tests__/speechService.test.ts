import { describe, it, expect, beforeEach } from 'vitest'
import { SpeechService } from '../speechService'

describe('SpeechService', () => {
  let service: SpeechService

  beforeEach(() => {
    service = new SpeechService()
  })

  describe('speechToText', () => {
    it('should return placeholder response', async () => {
      const result = await service.speechToText({
        audioData: 'base64encodedaudio',
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      })

      expect(result.transcript).toBe('Speech recognition is handled on the mobile device')
      expect(result.confidence).toBe(1.0)
      expect(result.detectedLanguage).toBe('en-US')
      expect(result.timestamp).toBeDefined()
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it('should include valid timestamp', async () => {
      const result = await service.speechToText({
        audioData: 'test',
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      })

      const timestamp = new Date(result.timestamp)
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now())
      expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 5000) // Within last 5 seconds
    })

    it('should work with different language codes', async () => {
      const languages = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP']

      for (const lang of languages) {
        const result = await service.speechToText({
          audioData: 'test',
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: lang,
        })

        expect(result.detectedLanguage).toBe('en-US') // Always returns en-US (placeholder)
      }
    })
  })

  describe('detectAudioLanguage', () => {
    it('should return default language', async () => {
      const result = await service.detectAudioLanguage('base64audio')

      expect(result).toBe('en-US')
    })

    it('should return default language for empty audio', async () => {
      const result = await service.detectAudioLanguage('')

      expect(result).toBe('en-US')
    })

    it('should always return consistent result', async () => {
      const result1 = await service.detectAudioLanguage('audio1')
      const result2 = await service.detectAudioLanguage('audio2')
      const result3 = await service.detectAudioLanguage('audio3')

      expect(result1).toBe(result2)
      expect(result2).toBe(result3)
      expect(result1).toBe('en-US')
    })
  })

  describe('constructor', () => {
    it('should create instance without errors', () => {
      expect(() => new SpeechService()).not.toThrow()
    })

    it('should not require initialization parameters', () => {
      const newService = new SpeechService()
      expect(newService).toBeInstanceOf(SpeechService)
    })
  })
})
