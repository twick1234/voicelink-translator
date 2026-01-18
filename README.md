# VoiceLink Translator

A real-time voice translation mobile application with automatic language detection, transcription, and intelligent summarization capabilities.

**100% FREE - No API Keys Required!**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Flutter](https://img.shields.io/badge/Flutter-3.16.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)
![Cost](https://img.shields.io/badge/cost-$0%2Fmonth-brightgreen.svg)
![API Keys](https://img.shields.io/badge/API%20Keys-0%20required-success.svg)

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-time Speech Recognition**: On-device speech-to-text conversion with language detection
- **Instant Translation**: FREE translation to 100+ languages using MyMemory API
- **Smart Summarization**: Simple extractive algorithm for conversation summaries
- **Speaker/Listener Tracking**: Clear distinction between conversation participants
- **Voice Commands**: Say "STOP" to end conversation and generate summary
- **Export Options**: Download conversations as PDF or TXT files
- **Offline Support**: Local storage of conversations + offline language detection
- **Multi-language Support**: 100+ languages supported
- **100% Free**: Zero monthly costs, no API keys required
- **Privacy First**: Speech recognition happens on-device, no audio sent to cloud

## Architecture

> For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

### Conceptual Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  VoiceLink Translator                    │
│                  (100% FREE - $0/month)                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Mobile     │◄───────►│   Backend    │             │
│  │   App        │  HTTPS  │   API        │             │
│  │  (Flutter)   │         │  (Vercel)    │             │
│  └──────────────┘         └──────────────┘             │
│         │                        │                       │
│         │                        ↓                       │
│         │              ┌──────────────────┐             │
│         │              │  FREE Services   │             │
│         │              │  • MyMemory API  │             │
│         │              │  • franc-min     │             │
│         │              └──────────────────┘             │
│         │                                                │
│         ↓                                                │
│  ┌──────────────┐                                       │
│  │   Local      │                                       │
│  │   Storage    │                                       │
│  │  (On-Device) │                                       │
│  └──────────────┘                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **On-Device Speech Recognition** - Uses Flutter's `speech_to_text` package (no cloud API)
2. **Offline Language Detection** - Uses `franc-min` library (no API calls)
3. **FREE Translation API** - MyMemory Translation API (no authentication required)
4. **Simple Summarization** - Extractive algorithm (no AI API needed)
5. **Serverless Backend** - Vercel free tier (generous limits)
6. **Local Data Storage** - No database needed (privacy-first approach)

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed conceptual, logical, and physical architecture diagrams.

## Technology Stack

### Mobile App
- **Framework**: Flutter 3.16.0
- **Language**: Dart
- **State Management**: Provider
- **Speech Recognition**: speech_to_text (on-device, no API)
- **PDF Generation**: pdf, printing
- **Testing**: flutter_test, mockito

### Backend API
- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.3
- **Framework**: Express.js
- **Deployment**: Vercel (Serverless - FREE tier)
- **Testing**: Jest, ts-jest
- **Dependencies**: axios, cors, helmet, dotenv, franc-min

### Free Services (No API Keys!)
- **Translation**: MyMemory Translation API (https://api.mymemory.translated.net)
  - No registration required
  - No API key needed
  - Generous free tier
- **Language Detection**: franc-min (offline library)
  - Runs in Node.js
  - No API calls
  - Supports 100+ languages
- **Speech Recognition**: Flutter speech_to_text
  - On-device processing
  - No cloud API needed
  - Privacy-first approach

## Prerequisites

Before you begin, ensure you have the following installed:

- **Flutter SDK**: 3.16.0 or higher
  ```bash
  flutter --version
  ```

- **Node.js**: 20.x or higher
  ```bash
  node --version
  npm --version
  ```

- **Git**: Latest version
  ```bash
  git --version
  ```

- **Xcode**: 15.0+ (for iOS development on macOS)
- **CocoaPods**: Latest version (for iOS)
  ```bash
  pod --version
  ```

**No API Keys Required!** This project uses 100% free services with no authentication.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/twick1234/voicelink-translator.git
cd voicelink-translator
```

### 2. Install Backend Dependencies

```bash
npm install
```

This will install:
- express (web framework)
- axios (HTTP client for MyMemory API)
- franc-min (offline language detection)
- cors, helmet (security)
- TypeScript and testing dependencies

### 3. Install Flutter Dependencies

```bash
cd mobile
flutter pub get
cd ..
```

### 4. Configure Environment Variables

#### Backend API (.env)

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

The `.env` file contains NO API keys - everything is free:

```env
# 🎉 NO API KEYS NEEDED! Everything is 100% FREE! 🎉

# Translation Service (MyMemory - FREE!)
# No API key required, generous free tier
# Language detection uses franc-min (offline)
MYMEMORY_API_URL=https://api.mymemory.translated.net

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,https://voicelink-translator.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Mobile App Configuration

The mobile app automatically connects to `localhost:3000` in development. No configuration needed!

For production, update `mobile/lib/services/api_service.dart` with your Vercel URL.

## Running the Application

### Start Backend API (Development)

```bash
npm run build    # Compile TypeScript
node dist/src/index.js
```

The API will be available at `http://localhost:3000`

Test it:
```bash
curl http://localhost:3000/api/health
```

### Run Flutter App

#### iOS Simulator

```bash
cd mobile
flutter run -d iPhone
```

#### Physical iOS Device

1. Connect your iPhone via USB
2. Trust the computer on your device
3. Run:
   ```bash
   cd mobile
   flutter run
   ```

## Testing

### Backend API Tests

Run all tests with coverage:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Manual API Testing

Test translation endpoint:
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","targetLanguage":"es"}'
```

Expected response:
```json
{
  "originalText": "Hello world",
  "translatedText": "Hola mundo",
  "detectedLanguage": "en",
  "confidence": 0.99,
  "timestamp": "2026-01-18T..."
}
```

### Flutter Tests

```bash
cd mobile
flutter test --coverage
```

## Deployment

### Deploy Backend to Vercel (FREE)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **No Environment Variables Needed** - Everything runs with free services!

The deployment is 100% free on Vercel's generous free tier.

### Deploy iOS App to TestFlight

1. **Configure Xcode**:
   ```bash
   cd mobile/ios
   open Runner.xcworkspace
   ```

2. **Update Bundle Identifier** in Xcode:
   - Select Runner project
   - Update Bundle Identifier to your unique ID

3. **Configure Signing**:
   - Select your team
   - Enable automatic signing

4. **Archive for TestFlight**:
   ```bash
   cd mobile
   flutter build ios --release
   ```

5. **Upload to App Store Connect**:
   - Open Xcode
   - Product → Archive
   - Upload to App Store Connect
   - Submit for TestFlight review

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Project Structure

```
voicelink-translator/
├── api/                          # Backend API
│   └── src/
│       ├── controllers/          # API controllers
│       ├── services/             # Business logic
│       │   ├── translationService.ts    # MyMemory API integration
│       │   ├── summarizationService.ts  # Extractive summarization
│       │   └── speechService.ts         # Speech service (placeholder)
│       ├── middleware/           # Express middleware
│       ├── types/                # TypeScript types
│       └── index.ts              # API entry point
├── mobile/                       # Flutter mobile app
│   ├── lib/
│   │   ├── models/               # Data models
│   │   ├── screens/              # UI screens
│   │   ├── services/             # API & business logic
│   │   ├── widgets/              # Reusable widgets
│   │   └── main.dart             # App entry point
│   ├── test/                     # Flutter tests
│   ├── ios/                      # iOS-specific files
│   ├── android/                  # Android-specific files
│   └── pubspec.yaml              # Flutter dependencies
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # Detailed architecture diagrams
│   ├── API_REFERENCE.md          # Complete API documentation
│   ├── DEPLOYMENT_GUIDE.md       # Deployment instructions
│   ├── DEVELOPMENT_GUIDE.md      # Development setup
│   └── TESTING_ON_MACOS.md       # iOS Simulator testing guide
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── vercel.json                   # Vercel configuration
├── .env.example                  # Example environment file (no secrets!)
├── dashboard.html                # Visual project dashboard
└── README.md                     # This file
```

## API Documentation

> For complete API documentation, see [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

### Base URL

- Development: `http://localhost:3000/api`
- Production: `https://voicelink-translator.vercel.app/api`

### Endpoints

#### Health Check
```
GET /api/health
Response: {
  "status": "healthy",
  "timestamp": "2026-01-18T07:24:28.338Z",
  "version": "1.0.0"
}
```

#### Translate Text
```
POST /api/translate
Body: {
  "text": "Hola mundo",
  "targetLanguage": "en",
  "sourceLanguage": "es" (optional - auto-detected if not provided)
}
Response: {
  "originalText": "Hola mundo",
  "translatedText": "Hello world",
  "detectedLanguage": "es",
  "confidence": 0.99,
  "timestamp": "2026-01-18T..."
}
```

**Note**: Speech-to-text is handled on-device by Flutter. The backend `/api/speech-to-text` endpoint is a placeholder for API compatibility.

#### Summarize Conversation
```
POST /api/summarize
Body: {
  "messages": [
    {
      "speaker": "speaker",
      "originalText": "Hello",
      "translatedText": "Hola",
      "detectedLanguage": "en",
      "timestamp": "2026-01-18T..."
    }
  ],
  "format": "brief" | "detailed"
}
Response: {
  "summary": "Conversation with 15 messages over 5 minutes...",
  "keyPoints": ["Discussed timing", "Discussed location"],
  "participantCount": 2,
  "duration": "5 minutes",
  "languagesDetected": ["en", "es"],
  "timestamp": "2026-01-18T..."
}
```

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| **MyMemory Translation API** | $0/month | Generous free tier, no auth required |
| **franc-min Language Detection** | $0/month | Offline library, no API calls |
| **Flutter speech_to_text** | $0/month | On-device processing |
| **Vercel Hosting** | $0/month | Free tier: 100 GB bandwidth, unlimited executions |
| **GitHub Repository** | $0/month | Free for public repos |
| **Total Monthly Cost** | **$0** | 🎉 **Completely FREE!** 🎉 |

## Privacy & Security

- **No Audio Cloud Processing** - All speech recognition happens on-device
- **No User Tracking** - Zero analytics or user tracking
- **Local Data Only** - Conversations stored exclusively on device
- **No PII Collection** - Backend doesn't store or log personal data
- **Anonymous Usage** - No authentication required
- **HTTPS Only** - All API calls encrypted
- **CORS Protection** - Restricted origins
- **Rate Limiting** - API throttling to prevent abuse

## SDLC & Traceability

### Development Lifecycle

1. **Planning**: Requirements gathering and BRD creation
2. **Design**: Architecture design (Conceptual, Logical, Physical)
3. **Development**: Iterative development with TypeScript + Flutter
4. **Testing**: Backend tested with 9/9 translation tests passing
5. **Deployment**: Serverless deployment on Vercel
6. **Maintenance**: Zero maintenance costs, automatic scaling

### Test Results

**Backend Translation Tests (9/9 Passed):**
- ✅ Health check
- ✅ English → Spanish
- ✅ French → English (99% confidence)
- ✅ German → English
- ✅ Japanese → English (99% confidence)
- ✅ Arabic → English
- ✅ Long text translation (45 words)
- ✅ Explicit source language
- ✅ Auto-detect with long text

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the maintainers.

## Acknowledgments

- **MyMemory (Translated S.r.l.)** for providing free translation API
- **franc-min** for offline language detection
- **Flutter team** for excellent mobile framework and on-device speech recognition
- **Vercel** for generous free tier and seamless deployment
- **Open Source Community** for making this 100% free solution possible

## Why This Architecture?

This project demonstrates that you can build a **production-quality voice translation app with $0 monthly costs** by:

1. Using on-device processing (speech recognition)
2. Leveraging free APIs (MyMemory Translation)
3. Using offline libraries (franc-min language detection)
4. Deploying on generous free tiers (Vercel)
5. Implementing simple algorithms (extractive summarization)

**No Google Cloud. No OpenAI. No monthly bills. Just great software. 🚀**

---

**Built with ❤️ using Flutter, Node.js, and 100% FREE services**

**Project Dashboard:** [dashboard.html](dashboard.html) - Open in your browser to see visual progress

**Documentation:** See [docs/](docs/) folder for detailed guides
