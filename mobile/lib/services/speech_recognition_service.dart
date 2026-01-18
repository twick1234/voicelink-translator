import 'dart:convert';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:permission_handler/permission_handler.dart';

class SpeechRecognitionService {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isInitialized = false;
  bool _isListening = false;

  bool get isInitialized => _isInitialized;
  bool get isListening => _isListening;

  Future<bool> initialize() async {
    if (_isInitialized) return true;

    // Request microphone permission
    final status = await Permission.microphone.request();
    if (!status.isGranted) {
      throw Exception('Microphone permission denied');
    }

    // Initialize speech recognition
    _isInitialized = await _speech.initialize(
      onError: (error) {
        print('Speech recognition error: $error');
      },
      onStatus: (status) {
        print('Speech recognition status: $status');
      },
    );

    return _isInitialized;
  }

  Future<void> startListening({
    required Function(String text, bool isFinal) onResult,
    String localeId = 'en_US',
  }) async {
    if (!_isInitialized) {
      await initialize();
    }

    if (_isListening) {
      await stopListening();
    }

    await _speech.listen(
      onResult: (result) {
        onResult(result.recognizedWords, result.finalResult);
        _isListening = !result.finalResult;
      },
      listenFor: const Duration(seconds: 30),
      pauseFor: const Duration(seconds: 3),
      partialResults: true,
      localeId: localeId,
      onSoundLevelChange: (level) {
        // Handle sound level changes if needed
      },
      cancelOnError: true,
      listenMode: stt.ListenMode.confirmation,
    );

    _isListening = true;
  }

  Future<void> stopListening() async {
    if (_isListening) {
      await _speech.stop();
      _isListening = false;
    }
  }

  Future<List<stt.LocaleName>> getAvailableLocales() async {
    if (!_isInitialized) {
      await initialize();
    }
    return await _speech.locales();
  }

  Future<bool> hasPermission() async {
    final status = await Permission.microphone.status;
    return status.isGranted;
  }

  void dispose() {
    if (_isListening) {
      _speech.stop();
    }
    _speech.cancel();
  }

  /// Detect "STOP" command from text
  bool detectStopCommand(String text) {
    final lowerText = text.toLowerCase().trim();
    return lowerText == 'stop' ||
        lowerText == 'stop listening' ||
        lowerText == 'end conversation' ||
        lowerText.endsWith('stop');
  }
}
