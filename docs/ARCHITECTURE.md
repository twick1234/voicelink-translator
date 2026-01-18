# VoiceLink Translator - Architecture Documentation

**Last Updated:** January 18, 2026
**Version:** 1.0.0
**Status:** 100% FREE - No API Keys Required

---

## Table of Contents

1. [Conceptual Architecture](#conceptual-architecture)
2. [Logical Architecture](#logical-architecture)
3. [Physical Architecture](#physical-architecture)
4. [Technology Stack](#technology-stack)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)

---

## Conceptual Architecture

The VoiceLink Translator follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                           │
│  👤 Mobile App Users (Speaker & Listener)                   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  📱 Flutter Mobile Application (iOS/Android)                │
│     ├─ Conversation Screen (Real-time UI)                   │
│     ├─ Speech Recognition (On-Device)                       │
│     ├─ Settings & Configuration                             │
│     └─ Export Functionality (PDF/TXT)                       │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                             │
│  ☁️  Node.js/Express Backend (Vercel Serverless)            │
│     ├─ Translation API (/api/translate)                     │
│     ├─ Summarization API (/api/summarize)                   │
│     ├─ Health Check (/api/health)                           │
│     └─ CORS & Rate Limiting                                 │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                           │
│  🌍 MyMemory Translation API (FREE - No Auth)               │
│  🔤 franc-min Language Detection (Offline)                  │
│  📊 Simple Extractive Summarization (In-Memory)             │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  💾 Local Device Storage (Conversations)                    │
│  📱 Flutter Shared Preferences (Settings)                   │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Zero Cost Operation** - All services are 100% free with no API keys required
2. **Privacy First** - Speech recognition happens on-device, no audio sent to cloud
3. **Offline Capable** - Language detection works offline using franc-min
4. **Serverless Architecture** - Backend runs on Vercel serverless functions
5. **Stateless Backend** - No database required, conversations stored locally

---

## Logical Architecture

### Component Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                      FLUTTER MOBILE APP                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                    UI LAYER                               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │    │
│  │  │ Conversation │  │   Settings   │  │    Export    │   │    │
│  │  │    Screen    │  │    Screen    │  │    Dialog    │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              STATE MANAGEMENT LAYER                       │    │
│  │  ┌─────────────────────────────────────────────────┐     │    │
│  │  │  ConversationProvider (ChangeNotifier)          │     │    │
│  │  │    ├─ Messages List                             │     │    │
│  │  │    ├─ Recording State                           │     │    │
│  │  │    ├─ Speaker/Listener Toggle                   │     │    │
│  │  │    └─ Summary Data                              │     │    │
│  │  └─────────────────────────────────────────────────┘     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                  SERVICE LAYER                            │    │
│  │  ┌──────────────────┐  ┌──────────────────┐             │    │
│  │  │ Speech           │  │  Translation     │             │    │
│  │  │ Recognition      │  │  API Client      │             │    │
│  │  │ Service          │  │                  │             │    │
│  │  │ (On-Device)      │  │  (HTTP to        │             │    │
│  │  │                  │  │   Backend)       │             │    │
│  │  └──────────────────┘  └──────────────────┘             │    │
│  │                                                           │    │
│  │  ┌──────────────────┐  ┌──────────────────┐             │    │
│  │  │   Export         │  │   Storage        │             │    │
│  │  │   Service        │  │   Service        │             │    │
│  │  │ (PDF/TXT)        │  │ (SharedPrefs)    │             │    │
│  │  └──────────────────┘  └──────────────────┘             │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
                            ▼ HTTP/HTTPS
┌────────────────────────────────────────────────────────────────────┐
│                    NODE.JS BACKEND (VERCEL)                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                    API LAYER                              │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │    │
│  │  │  Express   │  │   CORS     │  │   Rate     │         │    │
│  │  │  Routes    │  │ Middleware │  │  Limiter   │         │    │
│  │  └────────────┘  └────────────┘  └────────────┘         │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              CONTROLLER LAYER                             │    │
│  │  ┌──────────────────┐  ┌──────────────────┐             │    │
│  │  │  Translation     │  │  Summarization   │             │    │
│  │  │  Controller      │  │  Controller      │             │    │
│  │  └──────────────────┘  └──────────────────┘             │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                  SERVICE LAYER                            │    │
│  │  ┌──────────────────────────────────────────────┐        │    │
│  │  │  Translation Service                         │        │    │
│  │  │    ├─ MyMemory API Client (axios)           │        │    │
│  │  │    ├─ Language Detection (franc-min)        │        │    │
│  │  │    └─ ISO 639-3 to ISO 639-1 Mapping        │        │    │
│  │  └──────────────────────────────────────────────┘        │    │
│  │                                                           │    │
│  │  ┌──────────────────────────────────────────────┐        │    │
│  │  │  Summarization Service                       │        │    │
│  │  │    ├─ Extractive Algorithm                  │        │    │
│  │  │    ├─ Key Point Extraction                  │        │    │
│  │  │    └─ Metadata Analysis                     │        │    │
│  │  └──────────────────────────────────────────────┘        │    │
│  │                                                           │    │
│  │  ┌──────────────────────────────────────────────┐        │    │
│  │  │  Speech Service (Placeholder)                │        │    │
│  │  │    └─ Delegates to Flutter on-device        │        │    │
│  │  └──────────────────────────────────────────────┘        │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
                            ▼ HTTP GET
┌────────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES (FREE)                          │
│  🌍 MyMemory Translation API (https://api.mymemory.translated.net) │
│     └─ No Authentication Required                                 │
└────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### Mobile App Components

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **Conversation Screen** | Main UI for recording and displaying translations | Flutter Widgets |
| **Settings Screen** | App configuration and preferences | Flutter Widgets |
| **Export Dialog** | PDF/TXT export functionality | Flutter Dialogs |
| **ConversationProvider** | State management for messages and recording | Provider Pattern |
| **SpeechRecognitionService** | On-device speech-to-text | speech_to_text package |
| **TranslationApiClient** | HTTP client for backend API | http package |
| **ExportService** | PDF/TXT generation | pdf package |
| **StorageService** | Local data persistence | shared_preferences |

#### Backend Components

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **Express Routes** | API endpoint definitions | Express.js |
| **CORS Middleware** | Cross-origin request handling | cors package |
| **Rate Limiter** | API request throttling | Custom middleware |
| **Translation Controller** | Translation request handling | TypeScript |
| **Summarization Controller** | Summarization request handling | TypeScript |
| **Translation Service** | MyMemory API integration | axios |
| **Language Detection** | Offline language identification | franc-min |
| **Summarization Service** | Extractive text summarization | Native TypeScript |

---

## Physical Architecture

### Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         END USERS                               │
│  📱 iOS Devices          📱 Android Devices                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FLUTTER MOBILE APP                           │
│  Location: User's Device                                        │
│  Platform: iOS 12+ / Android 5.0+                               │
│  Size: ~15 MB                                                   │
│  Distribution: TestFlight (iOS) / Google Play (Android)         │
│                                                                 │
│  On-Device Features:                                            │
│  ├─ Speech Recognition (No internet required)                  │
│  ├─ Local Storage (SQLite/SharedPreferences)                   │
│  ├─ PDF Generation                                             │
│  └─ Language Detection (franc-min embedded)                    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS (REST API)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL PLATFORM                            │
│  Region: Auto (Global Edge Network)                             │
│  Plan: Free Tier                                                │
│  URL: https://voicelink-translator.vercel.app                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  Serverless Functions (Node.js 20.x)                  │     │
│  │  ├─ /api/health (Health check)                        │     │
│  │  ├─ /api/translate (Translation endpoint)             │     │
│  │  ├─ /api/summarize (Summarization endpoint)           │     │
│  │  └─ Auto-scaling: 0 to ∞ instances                    │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  Features:                                                      │
│  ├─ Automatic HTTPS                                            │
│  ├─ Global CDN                                                 │
│  ├─ Zero-config deployment                                     │
│  └─ Instant rollback capability                                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP GET (No Auth)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  MYMEMORY TRANSLATION API                       │
│  Provider: Translated S.r.l.                                    │
│  Endpoint: https://api.mymemory.translated.net                  │
│  Plan: Free (No registration required)                          │
│  Limits: Generous free tier                                     │
│  Uptime: 99.9%                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DEVELOPMENT                                │
│  📦 GitHub Repository                                           │
│  URL: https://github.com/twick1234/voicelink-translator         │
│  ├─ Source Code                                                │
│  ├─ Documentation                                              │
│  ├─ Issue Tracking                                             │
│  └─ Version Control                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Infrastructure Specifications

#### Mobile App Deployment

| Aspect | iOS | Android |
|--------|-----|---------|
| **Minimum Version** | iOS 12.0+ | Android 5.0 (API 21+) |
| **Distribution** | TestFlight → App Store | Internal Testing → Play Store |
| **Build Tool** | Xcode / Flutter CLI | Android Studio / Flutter CLI |
| **Code Signing** | Apple Developer Account | Google Play Console |
| **App Size** | ~12-15 MB | ~15-18 MB |

#### Backend Deployment (Vercel)

| Resource | Specification | Limit (Free Tier) |
|----------|---------------|-------------------|
| **Runtime** | Node.js 20.x | N/A |
| **Memory** | 1024 MB | Per function |
| **Timeout** | 10 seconds | Per request |
| **Bandwidth** | 100 GB/month | Total |
| **Executions** | Unlimited | N/A |
| **Deployment** | Git push (auto) | Unlimited |

#### External Services

| Service | Cost | Authentication | Rate Limit |
|---------|------|----------------|------------|
| **MyMemory Translation** | FREE | None | Generous |
| **franc-min** | FREE | N/A (Offline) | N/A |
| **Vercel Hosting** | FREE | Account | 100 GB/month |

---

## Technology Stack

### Frontend (Mobile)

```
Flutter 3.16.0
├── Dart 3.2.0
├── State Management
│   └── provider 6.1.1
├── Speech Recognition
│   └── speech_to_text 6.4.0 (On-Device)
├── PDF Generation
│   └── pdf 3.10.7
├── HTTP Client
│   └── http 1.1.2
├── Local Storage
│   └── shared_preferences 2.2.2
└── File Sharing
    └── share_plus 7.2.1
```

### Backend (API)

```
Node.js 20.x
├── TypeScript 5.3.3
├── Web Framework
│   └── Express 4.18.2
├── Translation
│   ├── axios 1.7.9 (HTTP client for MyMemory API)
│   └── franc-min 6.1.0 (Offline language detection)
├── Security
│   ├── helmet 7.1.0
│   └── cors 2.8.5
├── Configuration
│   └── dotenv 16.4.5
└── Testing
    └── jest 29.7.0
```

### External APIs

```
MyMemory Translation API
├── Endpoint: https://api.mymemory.translated.net
├── Method: HTTP GET
├── Format: JSON
├── Authentication: None
└── Cost: $0
```

---

## Data Flow

### Translation Request Flow

```
1. USER SPEAKS
   │
   ▼
2. FLUTTER: speech_to_text captures audio
   │ (On-device processing)
   ▼
3. FLUTTER: Transcript generated
   │
   ▼
4. FLUTTER: HTTP POST to /api/translate
   │ Body: { text: "Hello", targetLanguage: "es" }
   ▼
5. BACKEND: Translation Controller receives request
   │
   ▼
6. BACKEND: franc-min detects language (offline)
   │ Result: "en" (English)
   ▼
7. BACKEND: Translation Service calls MyMemory API
   │ GET https://api.mymemory.translated.net/get
   │ Params: q=Hello&langpair=en|es
   ▼
8. MYMEMORY: Returns translation
   │ Response: { translatedText: "Hola", confidence: 0.99 }
   ▼
9. BACKEND: Returns formatted response
   │ Response: {
   │   originalText: "Hello",
   │   translatedText: "Hola",
   │   detectedLanguage: "en",
   │   confidence: 0.99,
   │   timestamp: "2026-01-18T..."
   │ }
   ▼
10. FLUTTER: ConversationProvider updates state
    │
    ▼
11. FLUTTER: UI displays translation
    │
    ▼
12. FLUTTER: Saves to local storage
```

### Summarization Request Flow

```
1. USER SAYS "STOP"
   │
   ▼
2. FLUTTER: Speech recognition detects STOP command
   │
   ▼
3. FLUTTER: Triggers summarization
   │
   ▼
4. FLUTTER: HTTP POST to /api/summarize
   │ Body: { messages: [...], format: "detailed" }
   ▼
5. BACKEND: Summarization Controller receives request
   │
   ▼
6. BACKEND: Extractive Summarization Service
   │ ├─ Calculates duration
   │ ├─ Counts participants
   │ ├─ Extracts languages
   │ ├─ Identifies key points (keyword-based)
   │ └─ Generates summary text
   ▼
7. BACKEND: Returns summary
   │ Response: {
   │   summary: "Conversation with 15 messages...",
   │   keyPoints: ["Discussed timing", "Discussed location"],
   │   participantCount: 2,
   │   duration: "5 minutes",
   │   languagesDetected: ["en", "es"]
   │ }
   ▼
8. FLUTTER: Displays summary screen
   │
   ▼
9. USER: Can export as PDF or TXT
```

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: TRANSPORT SECURITY                            │
│  ├─ HTTPS/TLS 1.3 (All API calls encrypted)            │
│  ├─ Certificate pinning (optional, for production)     │
│  └─ Vercel automatic SSL                                │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: API SECURITY                                  │
│  ├─ CORS (Restricted origins)                          │
│  ├─ Rate Limiting (100 requests / 15 min)              │
│  ├─ Helmet.js (HTTP headers hardening)                 │
│  └─ Input validation & sanitization                    │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: DATA PRIVACY                                  │
│  ├─ No user authentication (anonymous usage)           │
│  ├─ No server-side data storage                        │
│  ├─ On-device speech processing (audio never sent)     │
│  └─ Local conversation storage only                    │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 4: OPERATIONAL SECURITY                          │
│  ├─ No API keys to leak (zero secrets)                 │
│  ├─ No database to secure                              │
│  ├─ Serverless (no server to patch)                    │
│  └─ Stateless architecture                             │
└─────────────────────────────────────────────────────────┘
```

### Privacy Guarantees

1. **Zero Cloud Audio Processing** - All speech recognition happens on-device
2. **No User Tracking** - No analytics, no user accounts, no tracking
3. **Local Data Only** - Conversations stored exclusively on device
4. **No PII Collection** - Backend doesn't store or log personal data
5. **Anonymous Translation** - MyMemory API doesn't require authentication

---

## Scalability Considerations

### Horizontal Scalability

- **Vercel Serverless**: Auto-scales from 0 to unlimited instances
- **MyMemory API**: Handles high request volumes
- **No Database**: No bottleneck from database connections
- **Stateless**: Each request is independent

### Performance Optimization

1. **On-Device Processing**
   - Speech recognition runs locally (instant response)
   - Language detection is offline (zero latency)

2. **API Optimization**
   - Lightweight franc-min library (fast detection)
   - MyMemory API typically responds in <500ms
   - Vercel edge functions (low latency globally)

3. **Caching Strategy**
   - Browser caching for static assets
   - No backend caching needed (stateless)

### Cost Optimization

- **$0 Monthly Cost** - All services are free
- **Pay-per-use** - Vercel free tier is generous
- **No Database Costs** - Local storage only
- **No API Key Costs** - MyMemory is free

---

## Future Architecture Enhancements

### Potential Upgrades (Optional)

1. **Real-time Sync** (if multi-device support needed)
   - Add Firebase Realtime Database (free tier)
   - Sync conversations across user's devices

2. **Improved AI Summarization** (if budget allows)
   - Integrate with free LLM APIs (e.g., Hugging Face)
   - Keep extractive summarization as fallback

3. **Voice Cloning** (future feature)
   - Explore free TTS APIs
   - Maintain on-device as primary option

4. **Offline Translation** (advanced feature)
   - Download language models for offline use
   - Use on-device ML models (TensorFlow Lite)

---

## Conclusion

The VoiceLink Translator architecture is designed for:

- **Zero Cost**: All services are 100% free
- **Privacy**: On-device processing, no cloud audio storage
- **Simplicity**: No complex infrastructure to maintain
- **Scalability**: Serverless auto-scaling
- **Reliability**: No single point of failure

This architecture delivers a production-ready voice translation app with **$0 monthly operational costs** while maintaining high quality and user privacy.
