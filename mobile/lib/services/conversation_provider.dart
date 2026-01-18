import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/conversation_message.dart';
import '../models/conversation_summary.dart';
import 'api_service.dart';
import 'speech_recognition_service.dart';
import 'export_service.dart';

class ConversationProvider extends ChangeNotifier {
  final ApiService _apiService;
  final SpeechRecognitionService _speechService;
  final ExportService _exportService;

  List<ConversationMessage> _messages = [];
  ConversationSummary? _summary;
  bool _isListening = false;
  bool _isTranslating = false;
  String _currentSpeaker = 'listener';
  String? _error;

  ConversationProvider({
    required ApiService apiService,
    required SpeechRecognitionService speechService,
    required ExportService exportService,
  })  : _apiService = apiService,
        _speechService = speechService,
        _exportService = exportService;

  // Getters
  List<ConversationMessage> get messages => List.unmodifiable(_messages);
  ConversationSummary? get summary => _summary;
  bool get isListening => _isListening;
  bool get isTranslating => _isTranslating;
  String get currentSpeaker => _currentSpeaker;
  String? get error => _error;

  /// Start listening for speech input
  Future<void> startListening() async {
    try {
      _error = null;
      _isListening = true;
      notifyListeners();

      await _speechService.startListening(
        onResult: (text, isFinal) async {
          if (isFinal && text.isNotEmpty) {
            // Check for STOP command
            if (_speechService.detectStopCommand(text)) {
              await stopAndSummarize();
              return;
            }

            // Translate the text
            await _translateAndAddMessage(text);
          }
        },
      );
    } catch (e) {
      _error = 'Failed to start listening: $e';
      _isListening = false;
      notifyListeners();
    }
  }

  /// Stop listening
  Future<void> stopListening() async {
    await _speechService.stopListening();
    _isListening = false;
    notifyListeners();
  }

  /// Stop and create summary
  Future<void> stopAndSummarize() async {
    await stopListening();

    if (_messages.isEmpty) {
      _error = 'No messages to summarize';
      notifyListeners();
      return;
    }

    try {
      _summary = await _apiService.summarizeConversation(
        messages: _messages,
        format: 'brief',
      );
      notifyListeners();
    } catch (e) {
      _error = 'Failed to create summary: $e';
      notifyListeners();
    }
  }

  /// Translate text and add to conversation
  Future<void> _translateAndAddMessage(String text) async {
    try {
      _isTranslating = true;
      notifyListeners();

      final translationResult = await _apiService.translateText(text: text);

      final message = ConversationMessage(
        id: const Uuid().v4(),
        speaker: _currentSpeaker,
        originalText: translationResult['originalText'] as String,
        translatedText: translationResult['translatedText'] as String,
        detectedLanguage: translationResult['detectedLanguage'] as String,
        timestamp: DateTime.parse(translationResult['timestamp'] as String),
        confidence: (translationResult['confidence'] as num).toDouble(),
      );

      _messages.add(message);
      _isTranslating = false;
      notifyListeners();
    } catch (e) {
      _error = 'Translation failed: $e';
      _isTranslating = false;
      notifyListeners();
    }
  }

  /// Toggle speaker role
  void toggleSpeaker() {
    _currentSpeaker = _currentSpeaker == 'listener' ? 'speaker' : 'listener';
    notifyListeners();
  }

  /// Manually add message (for testing or manual input)
  Future<void> addManualMessage(String text) async {
    await _translateAndAddMessage(text);
  }

  /// Clear conversation
  void clearConversation() {
    _messages.clear();
    _summary = null;
    _error = null;
    notifyListeners();
  }

  /// Export conversation to PDF
  Future<void> exportToPDF() async {
    try {
      final file = await _exportService.exportToPDF(
        messages: _messages,
        summary: _summary,
      );
      await _exportService.shareFile(file);
    } catch (e) {
      _error = 'Export to PDF failed: $e';
      notifyListeners();
    }
  }

  /// Export conversation to TXT
  Future<void> exportToTXT() async {
    try {
      final file = await _exportService.exportToTXT(
        messages: _messages,
        summary: _summary,
      );
      await _exportService.shareFile(file);
    } catch (e) {
      _error = 'Export to TXT failed: $e';
      notifyListeners();
    }
  }

  /// Delete a specific message
  void deleteMessage(String messageId) {
    _messages.removeWhere((msg) => msg.id == messageId);
    notifyListeners();
  }

  /// Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _speechService.dispose();
    _apiService.dispose();
    super.dispose();
  }
}
