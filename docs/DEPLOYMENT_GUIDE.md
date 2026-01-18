# Deployment Guide

Complete step-by-step guide for deploying VoiceLink Translator to production.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Deployment (Vercel)](#backend-deployment-vercel)
- [Mobile App Deployment (TestFlight)](#mobile-app-deployment-testflight)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring](#monitoring)

---

## Prerequisites

### Required Accounts

1. **GitHub Account** ✅ (Already set up)
2. **Vercel Account**
   - Sign up at https://vercel.com
   - Link GitHub account
3. **Apple Developer Account**
   - Enroll at https://developer.apple.com ($99/year)
4. **Google Cloud Account**
   - Sign up at https://console.cloud.google.com
5. **OpenAI Account**
   - Sign up at https://platform.openai.com

### Required Tools

```bash
# Verify installations
node --version     # Should be v20.x or higher
npm --version      # Should be v10.x or higher
git --version      # Any recent version
flutter --version  # Should be 3.16.0 or higher
```

---

## Backend Deployment (Vercel)

### Step 1: Obtain API Keys

#### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "VoiceLink Translator"
3. Enable APIs:
   ```
   - Cloud Translation API
   - Cloud Speech-to-Text API
   ```
4. Create credentials:
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
   - Click "Create Credentials" → "Service Account"
   - Download JSON key file

#### OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys
3. Click "Create new secret key"
4. Copy the key immediately (won't be shown again)

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 3: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 4: Configure Environment Variables

Create a `.env` file locally (don't commit this):

```env
# Google Cloud
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Server
PORT=3000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### Step 5: Deploy to Vercel

```bash
# From project root
cd /Users/marklindon/Projects/voicelink-translator

# First deployment (will prompt for project setup)
vercel

# Production deployment
vercel --prod
```

**Prompts you'll see**:
```
? Set up and deploy "voicelink-translator"? [Y/n] Y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] N
? What's your project's name? voicelink-translator
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

### Step 6: Add Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add each variable:
   - `GOOGLE_CLOUD_API_KEY`
   - `OPENAI_API_KEY`
   - `NODE_ENV` = `production`
   - `ALLOWED_ORIGINS` = `https://your-vercel-app.vercel.app`

**For Service Account JSON**:
- Copy the entire JSON content
- Create a variable `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- Paste the JSON as the value

Update `api/src/services/speechService.ts` to use the JSON:
```typescript
constructor() {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
    : undefined;

  this.client = new speech.v1.SpeechClient({
    credentials,
  });
}
```

### Step 7: Redeploy

```bash
vercel --prod
```

### Step 8: Get Your API URL

After deployment, you'll receive a URL like:
```
https://voicelink-translator.vercel.app
```

Your API will be available at:
```
https://voicelink-translator.vercel.app/api/health
```

---

## Mobile App Deployment (TestFlight)

### Step 1: Configure Mobile App

Update `mobile/.env`:

```env
API_BASE_URL=https://voicelink-translator.vercel.app
APP_NAME=VoiceLink Translator
APP_VERSION=1.0.0
```

### Step 2: Update iOS Configuration

```bash
cd mobile/ios
open Runner.xcworkspace
```

In Xcode:

1. **Select Runner** in Project Navigator
2. **Update General Settings**:
   - Display Name: `VoiceLink Translator`
   - Bundle Identifier: `com.yourcompany.voicelink` (must be unique)
   - Version: `1.0.0`
   - Build: `1`

3. **Configure Signing & Capabilities**:
   - Team: Select your Apple Developer team
   - Enable "Automatically manage signing"

4. **Add Capabilities** (if needed):
   - Microphone access (already in Info.plist)
   - Speech Recognition

### Step 3: Update Info.plist

Verify these keys exist in `mobile/ios/Runner/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for voice translation</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need access to speech recognition for translation</string>
```

### Step 4: Build for Release

```bash
cd mobile
flutter clean
flutter pub get
flutter build ios --release
```

### Step 5: Archive in Xcode

1. In Xcode, select "Any iOS Device (arm64)" as destination
2. Product → Archive
3. Wait for archive to complete
4. Organizer window will open automatically

### Step 6: Upload to App Store Connect

1. In Organizer, select your archive
2. Click "Distribute App"
3. Select "App Store Connect"
4. Click "Upload"
5. Select options:
   - ✅ Upload your app's symbols
   - ✅ Manage Version and Build Number
6. Click "Next" → "Upload"

### Step 7: Configure TestFlight

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app
3. Go to "TestFlight" tab
4. Wait for processing (5-15 minutes)
5. Once processed, click your build
6. Add "What to Test" notes:
   ```
   Testing VoiceLink Translator v1.0.0

   Features to test:
   - Real-time voice recognition
   - Translation accuracy
   - STOP command detection
   - PDF/TXT export
   - Conversation summarization
   ```

### Step 8: Add Testers

#### Internal Testing (Optional)
1. Click "Internal Testing"
2. Add App Store Connect users
3. Click "Save"

#### External Testing (Public Beta)
1. Click "External Testing"
2. Create a new group: "Beta Testers"
3. Add testers via email or public link
4. Submit for Beta App Review
5. Wait for approval (1-2 days)

### Step 9: Distribute TestFlight Link

After approval, share the public link:
```
https://testflight.apple.com/join/XXXXXXXX
```

Testers can:
1. Install TestFlight from App Store
2. Click the link
3. Install VoiceLink Translator

---

## Environment Configuration

### Production Environment Variables

#### Backend (Vercel)
```env
GOOGLE_CLOUD_API_KEY=your_production_key
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
OPENAI_API_KEY=your_production_key
NODE_ENV=production
ALLOWED_ORIGINS=https://voicelink-translator.vercel.app
PORT=3000
```

#### Mobile App
```env
API_BASE_URL=https://voicelink-translator.vercel.app
APP_NAME=VoiceLink Translator
APP_VERSION=1.0.0
```

### Staging Environment (Optional)

Deploy a staging version:

```bash
# Deploy to staging
vercel --env=staging

# Different domain: voicelink-translator-staging.vercel.app
```

---

## Post-Deployment Verification

### Backend API Tests

```bash
# Health check
curl https://voicelink-translator.vercel.app/api/health

# Expected response:
# {"status":"healthy","timestamp":"...","version":"1.0.0"}

# Test translation
curl -X POST https://voicelink-translator.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","targetLanguage":"es"}'

# Test supported languages
curl https://voicelink-translator.vercel.app/api/supported-languages
```

### Mobile App Tests

1. **Install via TestFlight**
2. **Test Core Features**:
   - [ ] App launches successfully
   - [ ] Microphone permission requested
   - [ ] Speech recognition works
   - [ ] Translation is accurate
   - [ ] STOP command triggers summary
   - [ ] PDF export works
   - [ ] TXT export works
3. **Test Error Scenarios**:
   - [ ] No internet connection
   - [ ] Invalid API response
   - [ ] Microphone permission denied

---

## Rollback Procedures

### Backend Rollback (Vercel)

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]

# Or via Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → "Promote to Production"
```

### Mobile App Rollback

1. Go to App Store Connect
2. TestFlight → Select your app
3. Find previous build
4. Submit to testers
5. Expire current build

**Note**: Cannot rollback installed apps, users must update manually.

---

## Monitoring

### Vercel Monitoring

1. **Analytics**: Vercel Dashboard → Analytics
   - Request counts
   - Response times
   - Error rates

2. **Logs**: Vercel Dashboard → Functions
   - Real-time function logs
   - Error traces

3. **Metrics to Monitor**:
   - API response times (< 2s target)
   - Error rate (< 1% target)
   - Function execution time
   - Bandwidth usage

### Mobile App Monitoring

1. **TestFlight Feedback**:
   - App Store Connect → TestFlight → Feedback
   - Screenshots from testers
   - Crash reports

2. **Metrics to Track**:
   - App crashes
   - User feedback
   - Feature usage
   - Performance issues

### Setting Up Alerts

Vercel alerts (Dashboard → Settings → Alerts):
- [ ] Error rate > 5%
- [ ] Response time > 5s
- [ ] Function timeout
- [ ] Deployment failures

---

## Continuous Deployment

### GitHub Actions (Optional)

The project includes a CI/CD workflow. To enable:

1. Create GitHub Actions secrets:
   ```
   VERCEL_TOKEN
   VERCEL_ORG_ID
   VERCEL_PROJECT_ID
   ```

2. Get values from Vercel:
   ```bash
   vercel link
   # Copy values from .vercel/project.json
   ```

3. Add to GitHub:
   - Repository → Settings → Secrets → Actions
   - Add each secret

4. Push to `main` branch triggers automatic deployment

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] API keys obtained
- [ ] Vercel account set up
- [ ] Apple Developer account active

### Backend Deployment
- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Environment variables added to Vercel
- [ ] Deployed to production
- [ ] API health check passes
- [ ] Test endpoints working

### Mobile Deployment
- [ ] Bundle ID configured
- [ ] Signing certificates valid
- [ ] Info.plist permissions added
- [ ] Build for release successful
- [ ] Uploaded to App Store Connect
- [ ] TestFlight configured
- [ ] Testers added
- [ ] Beta App Review approved

### Post-Deployment
- [ ] API monitoring enabled
- [ ] TestFlight feedback reviewed
- [ ] Performance metrics normal
- [ ] No critical errors
- [ ] Documentation updated
- [ ] Team notified

---

## Troubleshooting

### Common Issues

**Vercel deployment fails**:
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Ensure TypeScript compiles without errors

**API returns 500 errors**:
- Check Vercel function logs
- Verify environment variables are set
- Test API keys are valid

**Mobile build fails**:
- Run `flutter clean`
- Delete `Pods` folder and `Podfile.lock`
- Run `pod install` in `ios` folder
- Try building again

**TestFlight upload fails**:
- Verify Bundle ID is unique
- Check signing certificates
- Ensure all required fields filled

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Flutter Deployment**: https://docs.flutter.dev/deployment/ios
- **TestFlight**: https://developer.apple.com/testflight/
- **Google Cloud**: https://cloud.google.com/docs

---

**Last Updated**: January 18, 2026
