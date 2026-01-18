# API Reference Documentation

## VoiceLink Translator API

**Version**: 1.0.0
**Base URL (Development)**: `http://localhost:3000/api`
**Base URL (Production)**: `https://your-vercel-app.vercel.app/api`

---

## Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Translation](#translation-endpoints)
  - [Speech-to-Text](#speech-to-text-endpoints)
  - [Summarization](#summarization-endpoints)
- [Data Models](#data-models)
- [Status Codes](#status-codes)

---

## Authentication

Currently, the API uses API key authentication via environment variables. Future versions may implement JWT-based authentication.

**Headers Required**:
```
Content-Type: application/json
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "statusCode": 400,
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- Headers returned:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

---

## Endpoints

### Health Check

#### `GET /api/health`

Check API health status.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-18T12:00:00.000Z",
  "version": "1.0.0"
}
```

**Status Codes**:
- `200`: API is healthy
- `500`: API is unhealthy

---

### Translation Endpoints

#### `POST /api/translate`

Translate text from one language to another.

**Request Body**:
```json
{
  "text": "Hola mundo",
  "targetLanguage": "en",
  "sourceLanguage": "es"  // Optional - will auto-detect if not provided
}
```

**Response**:
```json
{
  "originalText": "Hola mundo",
  "translatedText": "Hello world",
  "detectedLanguage": "es",
  "confidence": 0.99,
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

**Parameters**:
- `text` (required, string): Text to translate
- `targetLanguage` (optional, string, default: "en"): Target language code
- `sourceLanguage` (optional, string): Source language code (auto-detected if omitted)

**Status Codes**:
- `200`: Success
- `400`: Invalid request (missing text)
- `500`: Translation failed

**Example**:
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour le monde",
    "targetLanguage": "en"
  }'
```

---

#### `POST /api/detect-language`

Detect the language of provided text.

**Request Body**:
```json
{
  "text": "Hola mundo"
}
```

**Response**:
```json
{
  "language": "es",
  "confidence": 0.99,
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

**Parameters**:
- `text` (required, string): Text to analyze

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `500`: Detection failed

---

#### `GET /api/supported-languages`

Get list of all supported languages.

**Response**:
```json
{
  "languages": [
    {
      "code": "en",
      "name": "English"
    },
    {
      "code": "es",
      "name": "Spanish"
    }
    // ... more languages
  ],
  "count": 133,
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

**Status Codes**:
- `200`: Success
- `500`: Failed to fetch languages

---

#### `POST /api/batch-translate`

Translate multiple texts in a single request.

**Request Body**:
```json
{
  "texts": [
    "Hola",
    "Bonjour",
    "Ciao"
  ],
  "targetLanguage": "en"
}
```

**Response**:
```json
{
  "results": [
    {
      "originalText": "Hola",
      "translatedText": "Hello",
      "detectedLanguage": "es",
      "confidence": 0.99,
      "timestamp": "2026-01-18T12:00:00.000Z"
    },
    // ... more results
  ],
  "count": 3,
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

**Parameters**:
- `texts` (required, array): Array of texts to translate (max 100)
- `targetLanguage` (optional, string, default: "en"): Target language code

**Status Codes**:
- `200`: Success
- `400`: Invalid request (empty array or > 100 items)
- `500`: Translation failed

---

### Speech-to-Text Endpoints

#### `POST /api/speech-to-text`

Convert audio to text.

**Request Body**:
```json
{
  "audioData": "base64_encoded_audio_data",
  "encoding": "LINEAR16",
  "sampleRateHertz": 16000,
  "languageCode": "en-US"
}
```

**Response**:
```json
{
  "transcript": "Hello world",
  "confidence": 0.95,
  "detectedLanguage": "en-US",
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

**Parameters**:
- `audioData` (required, string): Base64-encoded audio data
- `encoding` (optional, string, default: "LINEAR16"): Audio encoding format
- `sampleRateHertz` (optional, number, default: 16000): Sample rate
- `languageCode` (optional, string, default: "en-US"): Language code

**Supported Encodings**:
- LINEAR16
- FLAC
- MULAW
- AMR
- AMR_WB
- OGG_OPUS
- SPEEX_WITH_HEADER_BYTE

**Status Codes**:
- `200`: Success
- `400`: Invalid request (missing audio data)
- `500`: Transcription failed

---

#### `POST /api/detect-audio-language`

Detect language from audio without transcription.

**Request Body**:
```json
{
  "audioData": "base64_encoded_audio_data"
}
```

**Response**:
```json
{
  "languageCode": "en-US",
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `500`: Detection failed

---

#### `GET /api/speech/health`

Check speech service health.

**Response**:
```json
{
  "status": "healthy",
  "service": "speech-to-text",
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

---

### Summarization Endpoints

#### `POST /api/summarize`

Generate conversation summary using AI.

**Request Body**:
```json
{
  "messages": [
    {
      "id": "uuid-1",
      "speaker": "listener",
      "originalText": "Hola, ¿cómo estás?",
      "translatedText": "Hello, how are you?",
      "detectedLanguage": "es",
      "timestamp": "2026-01-18T12:00:00.000Z",
      "confidence": 0.99
    },
    {
      "id": "uuid-2",
      "speaker": "speaker",
      "originalText": "I'm good, thanks!",
      "translatedText": "I'm good, thanks!",
      "detectedLanguage": "en",
      "timestamp": "2026-01-18T12:01:00.000Z",
      "confidence": 1.0
    }
  ],
  "format": "brief"
}
```

**Response**:
```json
{
  "summary": "A friendly greeting exchange where one person asks how the other is doing in Spanish, and receives a positive response in English.",
  "keyPoints": [
    "Greeting exchange",
    "Multilingual conversation",
    "Positive interaction"
  ],
  "participantCount": 2,
  "duration": "1 minute",
  "languagesDetected": ["es", "en"],
  "timestamp": "2026-01-18T12:02:00.000Z"
}
```

**Parameters**:
- `messages` (required, array): Array of conversation messages (max 1000)
- `format` (optional, string, default: "brief"): "brief" or "detailed"

**Status Codes**:
- `200`: Success
- `400`: Invalid request (empty messages or > 1000 items)
- `500`: Summarization failed

---

#### `GET /api/summarize/health`

Check summarization service health.

**Response**:
```json
{
  "status": "healthy",
  "service": "summarization",
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

---

## Data Models

### TranslationRequest
```typescript
interface TranslationRequest {
  text: string;
  targetLanguage?: string;  // Default: "en"
  sourceLanguage?: string;  // Auto-detected if omitted
}
```

### TranslationResponse
```typescript
interface TranslationResponse {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  confidence: number;  // 0.0 - 1.0
  timestamp: string;   // ISO 8601 format
}
```

### SpeechToTextRequest
```typescript
interface SpeechToTextRequest {
  audioData: string;           // Base64 encoded
  encoding?: string;           // Default: "LINEAR16"
  sampleRateHertz?: number;    // Default: 16000
  languageCode?: string;       // Default: "en-US"
}
```

### SpeechToTextResponse
```typescript
interface SpeechToTextResponse {
  transcript: string;
  confidence: number;
  detectedLanguage: string;
  timestamp: string;
}
```

### ConversationMessage
```typescript
interface ConversationMessage {
  id: string;
  speaker: 'listener' | 'speaker';
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  timestamp: string;
  confidence: number;
}
```

### SummarizationRequest
```typescript
interface SummarizationRequest {
  messages: ConversationMessage[];
  format?: 'brief' | 'detailed';
}
```

### SummarizationResponse
```typescript
interface SummarizationResponse {
  summary: string;
  keyPoints: string[];
  participantCount: number;
  duration: string;
  languagesDetected: string[];
  timestamp: string;
}
```

### ApiError
```typescript
interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 404 | Not Found - Endpoint doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - API temporarily unavailable |

---

## Language Codes

Common language codes supported:

| Code | Language |
|------|----------|
| en | English |
| es | Spanish |
| fr | French |
| de | German |
| it | Italian |
| pt | Portuguese |
| ru | Russian |
| ja | Japanese |
| ko | Korean |
| zh | Chinese |
| ar | Arabic |
| hi | Hindi |

For full list, use `/api/supported-languages` endpoint.

---

## Best Practices

1. **Always validate input** before sending to API
2. **Handle errors gracefully** with proper error messages
3. **Implement retry logic** for transient failures
4. **Cache supported languages** to reduce API calls
5. **Use batch endpoints** when translating multiple texts
6. **Monitor rate limits** to avoid throttling
7. **Include source language** when known for better accuracy

---

## Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705581600
```

---

## CORS

The API supports CORS for allowed origins specified in environment variables.

Allowed origins can be configured via `ALLOWED_ORIGINS` environment variable.

---

## Versioning

Current API version: **v1**

Future versions will be accessible via `/api/v2/` prefix.

---

**Last Updated**: January 18, 2026
