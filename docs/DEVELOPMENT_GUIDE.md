# Development Guide

Complete guide for developing and contributing to VoiceLink Translator.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Contributing](#contributing)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
# Check versions
node --version     # v20.x or higher
npm --version      # v10.x or higher
flutter --version  # 3.16.0 or higher
git --version      # Latest
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/twick1234/voicelink-translator.git
cd voicelink-translator

# Install backend dependencies
npm install

# Install Flutter dependencies
cd mobile
flutter pub get
cd ..

# Copy environment variables
cp .env.example .env
cp mobile/.env.example mobile/.env

# Edit .env files with your API keys
nano .env
nano mobile/.env
```

---

## Development Environment Setup

### Backend Development

#### VS Code Extensions (Recommended)

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: TypeScript support
- **REST Client**: API testing

#### Run Development Server

```bash
# Terminal 1: Start API server with hot reload
npm run dev

# Server runs on http://localhost:3000
# API available at http://localhost:3000/api
```

#### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Translation
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","targetLanguage":"es"}'
```

### Mobile Development

#### VS Code Extensions (Recommended)

- **Flutter**: Flutter support
- **Dart**: Dart language support
- **Flutter Widget Snippets**: Widget templates

#### Run Flutter App

```bash
cd mobile

# List available devices
flutter devices

# Run on iOS Simulator
flutter run -d iPhone

# Run on physical device
flutter run

# Hot reload: Press 'r' in terminal
# Hot restart: Press 'R' in terminal
# Quit: Press 'q' in terminal
```

#### Flutter DevTools

```bash
# Open DevTools
flutter pub global activate devtools
flutter pub global run devtools

# Access at: http://localhost:9100
```

---

## Project Structure

### Backend Structure

```
api/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── translationController.ts
│   │   ├── speechController.ts
│   │   └── summarizationController.ts
│   ├── services/              # Business logic
│   │   ├── translationService.ts
│   │   ├── speechService.ts
│   │   └── summarizationService.ts
│   ├── middleware/            # Express middleware
│   │   └── errorHandler.ts
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   └── index.ts               # Express app entry point
```

### Mobile Structure

```
mobile/lib/
├── models/                    # Data models
│   ├── conversation_message.dart
│   └── conversation_summary.dart
├── screens/                   # UI screens
│   └── conversation_screen.dart
├── widgets/                   # Reusable widgets
│   ├── message_bubble.dart
│   ├── recording_button.dart
│   └── export_menu.dart
├── services/                  # Business logic & API
│   ├── api_service.dart
│   ├── speech_recognition_service.dart
│   ├── export_service.dart
│   └── conversation_provider.dart
└── main.dart                  # App entry point
```

---

## Coding Standards

### TypeScript/JavaScript

#### Code Style

```typescript
// Use TypeScript strict mode
// Use async/await over promises
// Use arrow functions for callbacks
// Use const/let, never var

// Good
const getUser = async (id: string): Promise<User> => {
  const user = await userService.findById(id);
  return user;
};

// Bad
var getUser = function(id) {
  return userService.findById(id).then(function(user) {
    return user;
  });
};
```

#### Naming Conventions

```typescript
// Classes: PascalCase
class TranslationService {}

// Interfaces: PascalCase with 'I' prefix (optional)
interface TranslationRequest {}

// Functions/Variables: camelCase
const translateText = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Files: kebab-case
// translation-service.ts
```

#### Error Handling

```typescript
// Always handle errors
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error(`Failed to process: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
```

### Dart/Flutter

#### Code Style

```dart
// Use const constructors when possible
// Use final for immutable variables
// Use meaningful names
// Add doc comments for public APIs

// Good
/// Translates text from source to target language
Future<TranslationResponse> translateText({
  required String text,
  String targetLanguage = 'en',
}) async {
  final response = await apiService.translate(text: text);
  return response;
}

// Bad
Future translate(t, l) async {
  var r = await api.translate(t);
  return r;
}
```

#### Naming Conventions

```dart
// Classes: PascalCase
class ConversationProvider {}

// Functions/Variables: camelCase
void startListening() {}
final String apiKey;

// Constants: lowerCamelCase
const double maxVolume = 1.0;

// Private members: _leadingUnderscore
String _privateField;

// Files: snake_case
// conversation_provider.dart
```

#### Widget Organization

```dart
class MyWidget extends StatelessWidget {
  // 1. Fields
  final String title;

  // 2. Constructor
  const MyWidget({Key? key, required this.title}) : super(key: key);

  // 3. Build method
  @override
  Widget build(BuildContext context) {
    return Container();
  }

  // 4. Private methods
  void _privateMethod() {}
}
```

### General Guidelines

- **DRY**: Don't Repeat Yourself
- **SOLID**: Follow SOLID principles
- **Comments**: Write self-documenting code, use comments for "why" not "what"
- **Tests**: Write tests for all new features
- **Git**: Write clear, descriptive commit messages

---

## Development Workflow

### Feature Development

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Implement Feature**
   - Write code
   - Add tests
   - Update documentation

3. **Test Locally**
   ```bash
   # Backend tests
   npm test

   # Flutter tests
   cd mobile && flutter test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: Add new feature description

   - Detailed change 1
   - Detailed change 2

   Closes #123"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/my-new-feature
   # Create Pull Request on GitHub
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(translation): Add batch translation endpoint

Implemented batch translation to handle multiple texts in single request.
Added rate limiting and validation for max 100 items.

Closes #45

fix(mobile): Fix STOP command detection

STOP command was not being recognized due to case sensitivity.
Changed to lowercase comparison.

Fixes #67
```

---

## Testing

### Backend Testing

#### Unit Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- translationService.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

#### Writing Tests

```typescript
// api/src/services/__tests__/translationService.test.ts
import TranslationService from '../translationService';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    service = new TranslationService();
  });

  it('should translate text correctly', async () => {
    const result = await service.translate({
      text: 'Hello',
      targetLanguage: 'es',
    });

    expect(result.translatedText).toBe('Hola');
    expect(result.detectedLanguage).toBe('en');
  });

  it('should handle errors gracefully', async () => {
    await expect(
      service.translate({ text: '' })
    ).rejects.toThrow('Text is required');
  });
});
```

### Mobile Testing

#### Unit Tests

```bash
cd mobile

# Run all tests
flutter test

# Run specific test
flutter test test/services/api_service_test.dart

# Run with coverage
flutter test --coverage
```

#### Writing Tests

```dart
// mobile/test/services/api_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:voicelink_translator/services/api_service.dart';

void main() {
  group('ApiService', () {
    late ApiService apiService;

    setUp(() {
      apiService = ApiService(baseUrl: 'http://localhost:3000');
    });

    test('should translate text successfully', () async {
      final result = await apiService.translateText(
        text: 'Hello',
        targetLanguage: 'es',
      );

      expect(result['translatedText'], 'Hola');
    });

    test('should throw exception on error', () async {
      expect(
        () => apiService.translateText(text: ''),
        throwsException,
      );
    });
  });
}
```

#### Widget Tests

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:voicelink_translator/widgets/message_bubble.dart';

void main() {
  testWidgets('MessageBubble displays message', (tester) async {
    final message = ConversationMessage(
      id: '1',
      speaker: 'listener',
      originalText: 'Hello',
      translatedText: 'Hola',
      detectedLanguage: 'en',
      timestamp: DateTime.now(),
      confidence: 0.99,
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MessageBubble(
            message: message,
            onDelete: () {},
          ),
        ),
      ),
    );

    expect(find.text('Hello'), findsOneWidget);
    expect(find.text('Hola'), findsOneWidget);
  });
}
```

---

## Debugging

### Backend Debugging

#### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/api/src/index.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### Console Logging

```typescript
// Development logging
console.log('Debug:', { variable });
console.error('Error occurred:', error);

// Production logging (use proper logger)
import winston from 'winston';
logger.info('Translation completed', { duration: 123 });
```

### Mobile Debugging

#### Flutter DevTools

```bash
# Start app in debug mode
flutter run

# In another terminal
flutter pub global run devtools

# Click link in terminal output
```

**DevTools Features**:
- Widget Inspector
- Performance Profiler
- Network Monitor
- Logging Console
- Memory Profiler

#### Print Debugging

```dart
// Development debugging
print('Debug: $variable');
debugPrint('Detailed debug message');

// Conditional logging
if (kDebugMode) {
  print('This only prints in debug mode');
}
```

#### Breakpoints in VS Code

1. Open file in VS Code
2. Click left of line number to set breakpoint
3. Press F5 to start debugging
4. App will pause at breakpoint

---

## Contributing

### Pull Request Process

1. **Fork Repository**
2. **Create Feature Branch**
3. **Make Changes**
4. **Write Tests**
5. **Update Documentation**
6. **Submit PR**

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No console errors
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Commit messages follow convention

### Code Review Guidelines

**For Reviewers**:
- Check for bugs and edge cases
- Verify tests are comprehensive
- Ensure code is readable
- Look for performance issues
- Validate documentation

**For Contributors**:
- Respond to feedback promptly
- Make requested changes
- Re-request review after updates
- Be open to suggestions

---

## Development Tips

### Hot Reload

**Backend**: Uses `nodemon` for auto-restart
```bash
npm run dev  # Auto-restarts on file changes
```

**Flutter**: Built-in hot reload
```bash
flutter run
# Press 'r' for hot reload
# Press 'R' for hot restart
```

### Performance Optimization

**Backend**:
- Use caching for repeated calls
- Implement request batching
- Optimize database queries
- Use compression middleware

**Mobile**:
- Use `const` constructors
- Implement lazy loading
- Optimize widget rebuilds
- Cache network responses

### Common Gotchas

1. **Environment Variables**: Restart dev server after changing `.env`
2. **Flutter Cache**: Run `flutter clean` if having build issues
3. **iOS Pods**: Delete `Pods` folder and run `pod install` if issues
4. **TypeScript**: Check `tsconfig.json` if imports fail

---

## Resources

### Documentation
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Flutter Docs](https://docs.flutter.dev/)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Charles Proxy](https://www.charlesproxy.com/) - Network debugging
- [Flutter DevTools](https://docs.flutter.dev/development/tools/devtools) - Flutter debugging

### Community
- [Stack Overflow](https://stackoverflow.com/)
- [Flutter Community](https://flutter.dev/community)
- [Node.js Discord](https://discord.com/invite/nodejs)

---

**Last Updated**: January 18, 2026
