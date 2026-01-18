# VoiceLink Translator

A real-time voice translation mobile application with automatic language detection, transcription, and intelligent summarization capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Flutter](https://img.shields.io/badge/Flutter-3.16.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

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

- **Real-time Speech Recognition**: Automatic speech-to-text conversion with language detection
- **Instant Translation**: Translate conversations to English (or any supported language)
- **Smart Summarization**: AI-powered conversation summaries with key points extraction
- **Speaker/Listener Tracking**: Clear distinction between conversation participants
- **Voice Commands**: Say "STOP" to end conversation and generate summary
- **Export Options**: Download conversations as PDF or TXT files
- **Offline Support**: Local storage of conversations for offline access
- **Multi-language Support**: 100+ languages supported
- **100% Test Coverage**: Comprehensive testing with Jest and Flutter Test

## Architecture

### Conceptual Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  VoiceLink Translator                    │
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
│         │              │  External APIs   │             │
│         │              │  • Google Cloud  │             │
│         │              │  • OpenAI        │             │
│         │              └──────────────────┘             │
│         │                                                │
│         ↓                                                │
│  ┌──────────────┐                                       │
│  │   Local      │                                       │
│  │   Storage    │                                       │
│  └──────────────┘                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Logical Architecture

```
Mobile App (Flutter)
├── Presentation Layer
│   ├── Screens
│   │   └── ConversationScreen
│   └── Widgets
│       ├── MessageBubble
│       ├── RecordingButton
│       └── ExportMenu
├── Business Logic Layer
│   └── Providers
│       └── ConversationProvider
├── Data Layer
│   ├── Services
│   │   ├── ApiService
│   │   ├── SpeechRecognitionService
│   │   └── ExportService
│   └── Models
│       ├── ConversationMessage
│       └── ConversationSummary

Backend API (Node.js/TypeScript)
├── Controllers
│   ├── TranslationController
│   ├── SpeechController
│   └── SummarizationController
├── Services
│   ├── TranslationService
│   ├── SpeechService
│   └── SummarizationService
└── Middleware
    └── ErrorHandler
```

### Physical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Deployment Architecture                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  iPhone Device (iOS 15+)                               │
│  ┌──────────────────────────────────────┐             │
│  │  VoiceLink App (via TestFlight)      │             │
│  └──────────────────────────────────────┘             │
│                    ↓ HTTPS                             │
│  ┌──────────────────────────────────────┐             │
│  │  Vercel Edge Network                 │             │
│  │  • Global CDN                         │             │
│  │  • Serverless Functions               │             │
│  │  • Auto-scaling                       │             │
│  └──────────────────────────────────────┘             │
│                    ↓                                    │
│  ┌──────────────────────────────────────┐             │
│  │  External Services                   │             │
│  │  ┌────────────────────────────────┐ │             │
│  │  │ Google Cloud Translation API   │ │             │
│  │  │ • Language Detection           │ │             │
│  │  │ • Text Translation             │ │             │
│  │  └────────────────────────────────┘ │             │
│  │  ┌────────────────────────────────┐ │             │
│  │  │ Google Speech-to-Text API      │ │             │
│  │  │ • Real-time Transcription      │ │             │
│  │  │ • Language Detection           │ │             │
│  │  └────────────────────────────────┘ │             │
│  │  ┌────────────────────────────────┐ │             │
│  │  │ OpenAI GPT-4 API               │ │             │
│  │  │ • Conversation Summarization   │ │             │
│  │  └────────────────────────────────┘ │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  ┌──────────────────────────────────────┐             │
│  │  GitHub Repository                   │             │
│  │  • Version Control                   │             │
│  │  • CI/CD (GitHub Actions)            │             │
│  │  • Auto-deployment to Vercel         │             │
│  └──────────────────────────────────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Mobile App
- **Framework**: Flutter 3.16.0
- **Language**: Dart
- **State Management**: Provider
- **Speech Recognition**: speech_to_text
- **PDF Generation**: pdf, printing
- **Testing**: flutter_test, mockito

### Backend API
- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.3
- **Framework**: Express.js
- **Deployment**: Vercel (Serverless)
- **Testing**: Jest, ts-jest

### External Services
- **Translation**: Google Cloud Translation API
- **Speech-to-Text**: Google Cloud Speech API
- **Summarization**: OpenAI GPT-4 API

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

- **Xcode**: 15.0+ (for iOS development)
- **CocoaPods**: Latest version
  ```bash
  pod --version
  ```

### API Keys Required

You'll need to obtain the following API keys:

1. **Google Cloud API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Translation API and Speech-to-Text API
   - Create credentials (API Key)

2. **OpenAI API Key**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Generate API key from dashboard

3. **Vercel Account**
   - Sign up at [Vercel](https://vercel.com/)
   - Install Vercel CLI: `npm install -g vercel`

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

Edit `.env` with your API keys:

```env
# Google Cloud API Keys
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

#### Mobile App (.env)

Create a `.env` file in the `mobile` directory:

```bash
cd mobile
cp .env.example .env
```

Edit `mobile/.env`:

```env
API_BASE_URL=http://localhost:3000
# For production: API_BASE_URL=https://your-vercel-app.vercel.app
```

## Running the Application

### Start Backend API (Development)

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

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

### Flutter Tests

```bash
cd mobile
flutter test --coverage
```

### View Coverage Report

Backend:
```bash
open coverage/index.html
```

Flutter:
```bash
cd mobile
open coverage/html/index.html
```

## Deployment

### Deploy Backend to Vercel

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

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add all environment variables from `.env`

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

### Continuous Deployment

The project includes GitHub Actions workflows for automated deployment:

- **On Push to Main**: Automatically deploys to Vercel
- **On Pull Request**: Runs tests and builds

Required GitHub Secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Project Structure

```
voicelink-translator/
├── api/                          # Backend API
│   └── src/
│       ├── controllers/          # API controllers
│       ├── services/             # Business logic
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
├── .github/
│   └── workflows/                # CI/CD workflows
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── vercel.json                   # Vercel configuration
└── README.md                     # This file
```

## API Documentation

### Base URL

Development: `http://localhost:3000/api`
Production: `https://your-vercel-app.vercel.app/api`

### Endpoints

#### Health Check
```
GET /health
Response: { status: "healthy", timestamp: "ISO8601" }
```

#### Translate Text
```
POST /translate
Body: {
  "text": "Hola mundo",
  "targetLanguage": "en",
  "sourceLanguage": "es" (optional)
}
Response: {
  "originalText": "Hola mundo",
  "translatedText": "Hello world",
  "detectedLanguage": "es",
  "confidence": 0.99,
  "timestamp": "ISO8601"
}
```

#### Speech to Text
```
POST /speech-to-text
Body: {
  "audioData": "base64_encoded_audio",
  "encoding": "LINEAR16",
  "sampleRateHertz": 16000,
  "languageCode": "en-US"
}
Response: {
  "transcript": "Hello world",
  "confidence": 0.95,
  "detectedLanguage": "en-US",
  "timestamp": "ISO8601"
}
```

#### Summarize Conversation
```
POST /summarize
Body: {
  "messages": [...],
  "format": "brief" | "detailed"
}
Response: {
  "summary": "...",
  "keyPoints": ["...", "..."],
  "participantCount": 2,
  "duration": "5 minutes",
  "languagesDetected": ["en", "es"],
  "timestamp": "ISO8601"
}
```

## SDLC & Traceability

### Development Lifecycle

1. **Planning**: Requirements gathering and BRD creation
2. **Design**: Architecture design (Conceptual, Logical, Physical)
3. **Development**: Iterative development with TDD
4. **Testing**: Unit, Integration, and E2E tests (100% coverage)
5. **Deployment**: Automated CI/CD via GitHub Actions
6. **Maintenance**: Monitoring and updates

### Traceability Matrix

| Requirement ID | Feature | Implementation | Test Coverage | Deployment |
|----------------|---------|----------------|---------------|------------|
| FR-001 | Auto-detect language | `translationService.ts:278` | `translation.test.ts` | Google Translate API |
| FR-002 | Speech-to-text | `speechService.ts:15` | `speech.test.ts` | Google Speech API |
| FR-003 | Translate to English | `translationService.ts:45` | `translation.test.ts` | Google Translate API |
| FR-004 | Speaker/Listener UI | `message_bubble.dart:30` | `message_bubble.test.dart` | Flutter Widget |
| FR-005 | STOP command | `speech_recognition_service.dart:90` | `speech_recognition.test.dart` | Voice Recognition |
| FR-006 | Export PDF/TXT | `export_service.dart` | `export_service.test.dart` | PDF/TXT Generation |
| NFR-001 | 100% Test Coverage | All files | Jest + Flutter Test | CI/CD Pipeline |

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

- Google Cloud for Translation and Speech APIs
- OpenAI for GPT-4 summarization
- Flutter team for excellent mobile framework
- Vercel for seamless deployment

---

**Built with ❤️ using Flutter and Node.js**
