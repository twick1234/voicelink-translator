class ConversationMessage {
  final String id;
  final String speaker; // 'listener' or 'speaker'
  final String originalText;
  final String translatedText;
  final String detectedLanguage;
  final DateTime timestamp;
  final double confidence;

  ConversationMessage({
    required this.id,
    required this.speaker,
    required this.originalText,
    required this.translatedText,
    required this.detectedLanguage,
    required this.timestamp,
    required this.confidence,
  });

  factory ConversationMessage.fromJson(Map<String, dynamic> json) {
    return ConversationMessage(
      id: json['id'] as String,
      speaker: json['speaker'] as String,
      originalText: json['originalText'] as String,
      translatedText: json['translatedText'] as String,
      detectedLanguage: json['detectedLanguage'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      confidence: (json['confidence'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'speaker': speaker,
      'originalText': originalText,
      'translatedText': translatedText,
      'detectedLanguage': detectedLanguage,
      'timestamp': timestamp.toIso8601String(),
      'confidence': confidence,
    };
  }

  ConversationMessage copyWith({
    String? id,
    String? speaker,
    String? originalText,
    String? translatedText,
    String? detectedLanguage,
    DateTime? timestamp,
    double? confidence,
  }) {
    return ConversationMessage(
      id: id ?? this.id,
      speaker: speaker ?? this.speaker,
      originalText: originalText ?? this.originalText,
      translatedText: translatedText ?? this.translatedText,
      detectedLanguage: detectedLanguage ?? this.detectedLanguage,
      timestamp: timestamp ?? this.timestamp,
      confidence: confidence ?? this.confidence,
    );
  }
}
