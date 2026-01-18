class ConversationSummary {
  final String summary;
  final List<String> keyPoints;
  final int participantCount;
  final String duration;
  final List<String> languagesDetected;
  final DateTime timestamp;

  ConversationSummary({
    required this.summary,
    required this.keyPoints,
    required this.participantCount,
    required this.duration,
    required this.languagesDetected,
    required this.timestamp,
  });

  factory ConversationSummary.fromJson(Map<String, dynamic> json) {
    return ConversationSummary(
      summary: json['summary'] as String,
      keyPoints: List<String>.from(json['keyPoints'] as List),
      participantCount: json['participantCount'] as int,
      duration: json['duration'] as String,
      languagesDetected: List<String>.from(json['languagesDetected'] as List),
      timestamp: DateTime.parse(json['timestamp'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'summary': summary,
      'keyPoints': keyPoints,
      'participantCount': participantCount,
      'duration': duration,
      'languagesDetected': languagesDetected,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}
