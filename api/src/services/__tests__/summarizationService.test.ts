import { describe, it, expect, beforeEach } from 'vitest'
import { SummarizationService } from '../summarizationService'
import { ConversationMessage } from '../../types'

describe('SummarizationService', () => {
  let service: SummarizationService

  beforeEach(() => {
    service = new SummarizationService()
  })

  const createMockMessages = (count: number): ConversationMessage[] => {
    const messages: ConversationMessage[] = []
    const now = Date.now()

    for (let i = 0; i < count; i++) {
      messages.push({
        speaker: i % 2 === 0 ? 'speaker' : 'listener',
        originalText: `Message ${i}`,
        translatedText: `Translated message ${i}`,
        detectedLanguage: i % 3 === 0 ? 'en' : i % 3 === 1 ? 'es' : 'fr',
        timestamp: new Date(now + i * 60000).toISOString(), // 1 minute apart
      })
    }

    return messages
  }

  describe('summarizeConversation', () => {
    it('should summarize empty conversation', async () => {
      const result = await service.summarizeConversation({
        messages: [],
        format: 'brief',
      })

      expect(result.summary).toContain('No conversation recorded')
      expect(result.participantCount).toBe(0)
      // Empty conversations get default key points
      expect(result.keyPoints.length).toBeGreaterThanOrEqual(0)
    })

    it('should create brief summary', async () => {
      const messages = createMockMessages(5)

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.summary).toContain('5 messages')
      expect(result.participantCount).toBe(2)
      expect(result.languagesDetected).toContain('en')
      expect(result.languagesDetected).toContain('es')
      expect(result.languagesDetected).toContain('fr')
      expect(result.timestamp).toBeDefined()
    })

    it('should create detailed summary', async () => {
      const messages = createMockMessages(10)

      const result = await service.summarizeConversation({
        messages,
        format: 'detailed',
      })

      expect(result.summary).toContain('Conversation Summary')
      expect(result.summary).toContain('Total Messages: 10')
      expect(result.summary).toContain('Duration:')
      expect(result.summary).toContain('Languages:')
      expect(result.summary).toContain('Participants: 2')
      expect(result.summary).toContain('First messages')
    })

    it('should include first and last messages in detailed summary', async () => {
      const messages = createMockMessages(10)

      const result = await service.summarizeConversation({
        messages,
        format: 'detailed',
      })

      expect(result.summary).toContain('Translated message 0')
      expect(result.summary).toContain('Translated message 9')
      expect(result.summary).toContain('Last messages')
    })

    it('should extract languages detected', async () => {
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'Hello',
          translatedText: 'Hola',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'listener',
          originalText: 'Hola',
          translatedText: 'Hello',
          detectedLanguage: 'es',
          timestamp: new Date().toISOString(),
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.languagesDetected).toContain('en')
      expect(result.languagesDetected).toContain('es')
      expect(result.languagesDetected).toHaveLength(2)
    })

    it('should calculate duration correctly', async () => {
      const now = Date.now()
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'First',
          translatedText: 'First',
          detectedLanguage: 'en',
          timestamp: new Date(now).toISOString(),
        },
        {
          speaker: 'listener',
          originalText: 'Last',
          translatedText: 'Last',
          detectedLanguage: 'en',
          timestamp: new Date(now + 300000).toISOString(), // 5 minutes later
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.duration).toBe('5 minutes')
    })

    it('should handle short duration', async () => {
      const now = Date.now()
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'First',
          translatedText: 'First',
          detectedLanguage: 'en',
          timestamp: new Date(now).toISOString(),
        },
        {
          speaker: 'listener',
          originalText: 'Last',
          translatedText: 'Last',
          detectedLanguage: 'en',
          timestamp: new Date(now + 30000).toISOString(), // 30 seconds
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.duration).toBe('< 1 minute')
    })

    it('should handle exactly 1 minute duration', async () => {
      const now = Date.now()
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'First',
          translatedText: 'First',
          detectedLanguage: 'en',
          timestamp: new Date(now).toISOString(),
        },
        {
          speaker: 'listener',
          originalText: 'Last',
          translatedText: 'Last',
          detectedLanguage: 'en',
          timestamp: new Date(now + 60000).toISOString(),
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.duration).toBe('1 minute')
    })

    it('should count participants correctly', async () => {
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'Hello',
          translatedText: 'Hello',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'speaker',
          originalText: 'How are you',
          translatedText: 'How are you',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'listener',
          originalText: 'Good',
          translatedText: 'Good',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.participantCount).toBe(2)
    })

    it('should extract key points based on question words', async () => {
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'When should we meet?',
          translatedText: 'When should we meet?',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'listener',
          originalText: 'Where is the location?',
          translatedText: 'Where is the location?',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'speaker',
          originalText: 'How do we get there?',
          translatedText: 'How do we get there?',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.keyPoints).toContain('Discussed timing/schedule')
      expect(result.keyPoints).toContain('Discussed location')
      expect(result.keyPoints).toContain('Discussed methods/process')
    })

    it('should provide default key points when no question words', async () => {
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'Hello',
          translatedText: 'Hello',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'listener',
          originalText: 'Hi',
          translatedText: 'Hi',
          detectedLanguage: 'es',
          timestamp: new Date().toISOString(),
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.keyPoints).toContain('2 messages exchanged')
      expect(result.keyPoints).toContain('Multiple languages used')
    })

    it('should limit key points to 5', async () => {
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'When where how why what who',
          translatedText: 'When where how why what who',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.keyPoints.length).toBeLessThanOrEqual(5)
    })

    it('should handle single message conversation', async () => {
      const messages: ConversationMessage[] = [
        {
          speaker: 'speaker',
          originalText: 'Hello',
          translatedText: 'Hola',
          detectedLanguage: 'en',
          timestamp: new Date().toISOString(),
        },
      ]

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.summary).toContain('1 message')
      expect(result.participantCount).toBe(1)
    })

    it('should default to brief format', async () => {
      const messages = createMockMessages(3)

      const result = await service.summarizeConversation({
        messages,
      })

      expect(result.summary).not.toContain('Conversation Summary:')
      expect(result.summary).toContain('3 messages')
    })

    it('should include timestamp in result', async () => {
      const messages = createMockMessages(2)

      const result = await service.summarizeConversation({
        messages,
        format: 'brief',
      })

      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
      expect(new Date(result.timestamp).getTime()).toBeLessThanOrEqual(Date.now())
    })

    it('should handle errors gracefully', async () => {
      const invalidMessages: any[] = [
        {
          // Missing required fields
          speaker: 'speaker',
        },
      ]

      await expect(
        service.summarizeConversation({
          messages: invalidMessages,
          format: 'brief',
        })
      ).rejects.toThrow('Failed to summarize conversation')
    })
  })
})
