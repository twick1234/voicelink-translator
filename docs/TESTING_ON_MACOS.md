# Testing VoiceLink Translator on macOS

Complete guide for testing the mobile app on your MacBook without a physical iPhone.

---

## iOS Simulator (Recommended)

### What is iOS Simulator?

iOS Simulator is a virtual iPhone/iPad that runs on your Mac. It comes bundled with Xcode and allows you to test iOS apps without a physical device.

**Features**:
- Simulates actual iPhone hardware
- Tests different iPhone models (iPhone 15, 14, SE, etc.)
- Tests different iOS versions
- Access to microphone and camera
- Supports most iOS features

---

## Prerequisites

### 1. Install Xcode

```bash
# Check if Xcode is installed
xcode-select --version

# If not installed, download from App Store
# OR use command line:
xcode-select --install
```

**Full Xcode Installation** (Recommended):
1. Open **App Store**
2. Search for "Xcode"
3. Click **Get** (it's free, but large ~15GB)
4. Wait for installation (30-60 minutes)

### 2. Accept Xcode License

```bash
sudo xcodebuild -license accept
```

### 3. Install CocoaPods

```bash
sudo gem install cocoapods
```

### 4. Verify Flutter Can See Simulators

```bash
flutter devices
```

**Expected Output**:
```
2 connected devices:

iPhone 15 Pro (mobile) • XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX • ios • com.apple.CoreSimulator.SimRuntime.iOS-17-2 (simulator)
macOS (desktop)        • macos                                • darwin-arm64 • macOS 14.2.1 23C71 darwin-arm64
```

---

## Launching iOS Simulator

### Method 1: Via Xcode

1. Open **Xcode**
2. Menu: **Xcode** → **Open Developer Tool** → **Simulator**
3. Simulator window opens

**Choose iPhone Model**:
- Menu: **File** → **Open Simulator** → **iOS 17.2** → **iPhone 15 Pro**

### Method 2: Via Command Line

```bash
# Open default simulator
open -a Simulator

# OR start specific simulator
xcrun simctl list devices
xcrun simctl boot "iPhone 15 Pro"
```

### Method 3: Via Flutter

```bash
cd /Users/marklindon/Projects/voicelink-translator/mobile

# List available devices
flutter devices

# Run on iOS Simulator (automatically opens if not running)
flutter run -d "iPhone 15 Pro"

# OR just
flutter run
# Then select iOS Simulator from the list
```

---

## Running VoiceLink App in Simulator

### Step 1: Start Backend API

```bash
# Terminal 1 - Backend
cd /Users/marklindon/Projects/voicelink-translator
npm run dev
```

**Verify backend is running**:
```bash
curl http://localhost:3000/api/health
```

### Step 2: Configure Mobile App for Localhost

Update `mobile/.env`:
```env
# For iOS Simulator, use localhost
API_BASE_URL=http://localhost:3000
```

### Step 3: Run Flutter App

```bash
# Terminal 2 - Flutter
cd /Users/marklindon/Projects/voicelink-translator/mobile

# Get dependencies
flutter pub get

# Run on simulator
flutter run
```

**What happens**:
1. Flutter compiles your app
2. iOS Simulator automatically opens (if not already)
3. App installs on simulator
4. App launches automatically
5. You can interact with the app in the Simulator window

### Step 4: Test the App

In the Simulator:

1. **Grant Microphone Permission**:
   - Tap "Allow" when prompted for microphone access

2. **Test Voice Recognition**:
   - Click the microphone button in the app
   - Speak into your Mac's microphone
   - Watch as text appears and gets translated

3. **Test STOP Command**:
   - Say "STOP" while recording
   - Verify summary is generated

4. **Test Export**:
   - Tap export menu (download icon)
   - Choose PDF or TXT
   - File should be shared via simulator

---

## Simulator Tips & Tricks

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ + R` | Reload app (Flutter hot reload) |
| `⌘ + Shift + H` | Go to home screen |
| `⌘ + Shift + H` (double) | Show app switcher |
| `⌘ + L` | Lock screen |
| `⌘ + S` | Take screenshot |
| `⌘ + K` | Toggle keyboard |
| `⌘ + →` | Rotate right |
| `⌘ + ←` | Rotate left |
| `⌘ + 1` | Scale to 100% |
| `⌘ + 2` | Scale to 75% |
| `⌘ + 3` | Scale to 50% |

### Using Your Mac's Hardware

**Microphone**:
- Simulator uses your Mac's microphone
- Speak normally into your Mac
- Audio input works like a real iPhone

**Camera** (if needed):
- Simulator uses your Mac's camera
- Or shows test patterns

**Location** (if needed):
- Simulator can simulate GPS locations
- Menu: **Features** → **Location** → Choose location

### Simulating Different Devices

Test on multiple iPhone models:

```bash
# List all available simulators
xcrun simctl list devices available

# Common devices to test:
flutter run -d "iPhone 15 Pro Max"  # Large screen
flutter run -d "iPhone SE (3rd generation)"  # Small screen
flutter run -d "iPhone 14"  # Standard size
```

**Why test multiple devices?**:
- Different screen sizes
- Different resolutions
- Different iOS versions
- Ensure UI looks good on all devices

---

## Debugging in Simulator

### Flutter DevTools

```bash
# While app is running, open DevTools
flutter pub global run devtools
```

Access at: `http://localhost:9100`

**DevTools Features**:
- **Widget Inspector**: View widget tree
- **Network**: Monitor API calls
- **Logging**: See console output
- **Performance**: Profile app performance

### Console Logs

View Flutter logs in terminal:
```bash
# Logs appear automatically when running
flutter run

# Filter logs
flutter run --verbose
```

View Xcode logs:
1. Open **Console.app** on Mac
2. Select your simulator device
3. Filter for your app name

### Hot Reload

Make code changes while app is running:

```bash
# In terminal where flutter run is active:
# Press 'r' for hot reload (preserves state)
# Press 'R' for hot restart (resets state)
# Press 'q' to quit
```

**Example workflow**:
1. Change button color in `conversation_screen.dart`
2. Save file
3. Press `r` in terminal
4. See change instantly in Simulator!

---

## Simulating Network Conditions

Test app behavior with poor connectivity:

### In Simulator

1. Menu: **Debug** → **Simulate Location**
2. Choose location

### Using Network Link Conditioner

1. Install from **Xcode** → **Open Developer Tool** → **More Developer Tools**
2. Download "Additional Tools for Xcode"
3. Open "Network Link Conditioner.prefPane"
4. Test different network conditions:
   - WiFi
   - 4G LTE
   - 3G
   - Edge
   - Custom

---

## Limitations of Simulator

### What Works

✅ UI testing
✅ Logic testing
✅ API calls
✅ Microphone input
✅ Camera (basic)
✅ Most iOS features

### What Doesn't Work

❌ Face ID / Touch ID (can simulate)
❌ Real GPS tracking
❌ Some hardware sensors
❌ Apple Pay
❌ Push notifications (requires device)
❌ Some performance metrics

---

## Recording Simulator Screen

### Built-in Screen Recording

1. Click anywhere in Simulator
2. Press `⌘ + R` to start recording
3. Click **Stop** in menu bar when done
4. Video saved to Desktop

### Using QuickTime

1. Open **QuickTime Player**
2. **File** → **New Screen Recording**
3. Select Simulator window
4. Click record

---

## Testing on Physical iPhone (Optional)

If you want to test on your actual iPhone:

### Step 1: Connect iPhone

1. Connect iPhone to Mac via USB cable
2. Trust computer on iPhone when prompted

### Step 2: Enable Developer Mode

On iPhone:
1. **Settings** → **Privacy & Security**
2. Scroll down to **Developer Mode**
3. Toggle ON
4. Restart iPhone

### Step 3: Run on Device

```bash
# List devices
flutter devices

# Should show your iPhone
# iPhone (mobile) • XXXXX • ios • iOS 17.2.1 21C66

# Run on device
flutter run -d [your-device-id]
```

**Note for localhost API**:
- iPhone can't access `localhost` on your Mac
- Use your Mac's local IP instead:
  ```bash
  ifconfig | grep "inet "
  # Find your IP (e.g., 192.168.1.100)
  ```
- Update `mobile/.env`:
  ```env
  API_BASE_URL=http://192.168.1.100:3000
  ```

---

## Quick Start Checklist

- [ ] Xcode installed
- [ ] Flutter doctor passes
- [ ] Backend API running on localhost:3000
- [ ] Mobile .env configured for localhost
- [ ] Flutter dependencies installed (`flutter pub get`)
- [ ] Run `flutter run`
- [ ] iOS Simulator opens automatically
- [ ] App installs and launches
- [ ] Microphone permission granted
- [ ] Test voice recognition
- [ ] Test translation
- [ ] Test STOP command
- [ ] Test export functionality

---

## Troubleshooting

### Simulator won't start

```bash
# Reset simulator
xcrun simctl erase all

# Restart Xcode
killall Simulator Xcode
open -a Xcode
```

### App won't install

```bash
# Clean Flutter build
cd mobile
flutter clean
rm -rf ios/Pods
rm ios/Podfile.lock

# Reinstall
cd ios
pod install
cd ..
flutter pub get
flutter run
```

### Microphone not working

1. Check Mac System Preferences:
   - **Settings** → **Privacy & Security** → **Microphone**
   - Ensure Simulator has permission

2. In Simulator:
   - **Settings** → **Privacy** → **Microphone**
   - Enable for VoiceLink Translator

### API not connecting

```bash
# Verify backend is running
curl http://localhost:3000/api/health

# Check mobile/.env has correct URL
cat mobile/.env
# Should show: API_BASE_URL=http://localhost:3000

# Restart Flutter app
# Press 'r' in terminal or 'R' for full restart
```

---

## Alternative: Web Version (Future)

Flutter also supports web deployment. To run in browser:

```bash
cd mobile
flutter run -d chrome
```

This opens the app in Chrome browser on your Mac!

**Note**: Some features may not work in web version (microphone might need permissions).

---

## Resources

- **Xcode Simulator Guide**: https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device
- **Flutter iOS Setup**: https://docs.flutter.dev/get-started/install/macos#ios-setup
- **Flutter Testing**: https://docs.flutter.dev/testing

---

**Summary**: Use the **iOS Simulator** (comes with Xcode) to test the VoiceLink app on your MacBook. It's like having a virtual iPhone running on your Mac!

---

**Last Updated**: January 18, 2026
