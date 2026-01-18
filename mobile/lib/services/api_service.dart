import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/conversation_message.dart';
import '../models/conversation_summary.dart';

class ApiService {
  final String baseUrl;
  late final http.Client client;

  ApiService({required this.baseUrl}) {
    client = http.Client();
  }

  // Translation API
  Future<Map<String, dynamic>> translateText({
    required String text,
    String targetLanguage = 'en',
    String? sourceLanguage,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/api/translate'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'text': text,
          'targetLanguage': targetLanguage,
          if (sourceLanguage != null) 'sourceLanguage': sourceLanguage,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Translation failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Translation error: $e');
    }
  }

  // Language Detection API
  Future<Map<String, dynamic>> detectLanguage(String text) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/api/detect-language'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'text': text}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Language detection failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Language detection error: $e');
    }
  }

  // Speech-to-Text API
  Future<Map<String, dynamic>> speechToText({
    required String audioData,
    String encoding = 'LINEAR16',
    int sampleRateHertz = 16000,
    String languageCode = 'en-US',
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/api/speech-to-text'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'audioData': audioData,
          'encoding': encoding,
          'sampleRateHertz': sampleRateHertz,
          'languageCode': languageCode,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Speech-to-text failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Speech-to-text error: $e');
    }
  }

  // Summarization API
  Future<ConversationSummary> summarizeConversation({
    required List<ConversationMessage> messages,
    String format = 'brief',
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/api/summarize'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'messages': messages.map((m) => m.toJson()).toList(),
          'format': format,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return ConversationSummary.fromJson(data);
      } else {
        throw Exception('Summarization failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Summarization error: $e');
    }
  }

  // Get Supported Languages
  Future<List<Map<String, String>>> getSupportedLanguages() async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/api/supported-languages'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final languages = data['languages'] as List;
        return languages
            .map((lang) => {
                  'code': lang['code'] as String,
                  'name': lang['name'] as String,
                })
            .toList();
      } else {
        throw Exception('Failed to fetch languages: ${response.body}');
      }
    } catch (e) {
      throw Exception('Languages fetch error: $e');
    }
  }

  // Health Check
  Future<bool> healthCheck() async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/api/health'),
        headers: {'Content-Type': 'application/json'},
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  void dispose() {
    client.close();
  }
}
