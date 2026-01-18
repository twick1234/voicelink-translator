import 'dart:io';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart';
import '../models/conversation_message.dart';
import '../models/conversation_summary.dart';

class ExportService {
  /// Export conversation to PDF
  Future<File> exportToPDF({
    required List<ConversationMessage> messages,
    ConversationSummary? summary,
  }) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        build: (context) {
          final widgets = <pw.Widget>[];

          // Title
          widgets.add(
            pw.Header(
              level: 0,
              child: pw.Text(
                'VoiceLink Conversation',
                style: pw.TextStyle(
                  fontSize: 24,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
            ),
          );

          widgets.add(pw.SizedBox(height: 20));

          // Summary section if available
          if (summary != null) {
            widgets.add(
              pw.Container(
                padding: const pw.EdgeInsets.all(10),
                decoration: pw.BoxDecoration(
                  border: pw.Border.all(color: PdfColors.grey400),
                  borderRadius: const pw.BorderRadius.all(pw.Radius.circular(5)),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text(
                      'Summary',
                      style: pw.TextStyle(
                        fontSize: 18,
                        fontWeight: pw.FontWeight.bold,
                      ),
                    ),
                    pw.SizedBox(height: 10),
                    pw.Text(summary.summary),
                    pw.SizedBox(height: 10),
                    pw.Text(
                      'Duration: ${summary.duration}',
                      style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700),
                    ),
                    pw.Text(
                      'Languages: ${summary.languagesDetected.join(', ')}',
                      style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700),
                    ),
                  ],
                ),
              ),
            );

            widgets.add(pw.SizedBox(height: 20));
          }

          // Conversation messages
          widgets.add(
            pw.Text(
              'Conversation',
              style: pw.TextStyle(
                fontSize: 18,
                fontWeight: pw.FontWeight.bold,
              ),
            ),
          );

          widgets.add(pw.SizedBox(height: 10));

          for (final message in messages) {
            final isListener = message.speaker == 'listener';

            widgets.add(
              pw.Container(
                margin: const pw.EdgeInsets.only(bottom: 10),
                padding: const pw.EdgeInsets.all(10),
                decoration: pw.BoxDecoration(
                  color: isListener ? PdfColors.blue50 : PdfColors.green50,
                  borderRadius: const pw.BorderRadius.all(pw.Radius.circular(5)),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text(
                      isListener ? 'Listener' : 'Speaker',
                      style: pw.TextStyle(
                        fontWeight: pw.FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                    pw.SizedBox(height: 5),
                    pw.Text(
                      'Original [${message.detectedLanguage}]: ${message.originalText}',
                      style: const pw.TextStyle(fontSize: 11),
                    ),
                    pw.SizedBox(height: 3),
                    pw.Text(
                      'Translation: ${message.translatedText}',
                      style: const pw.TextStyle(fontSize: 11, color: PdfColors.grey700),
                    ),
                  ],
                ),
              ),
            );
          }

          return widgets;
        },
      ),
    );

    // Save PDF to file
    final directory = await getApplicationDocumentsDirectory();
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final filePath = '${directory.path}/conversation_$timestamp.pdf';
    final file = File(filePath);
    await file.writeAsBytes(await pdf.save());

    return file;
  }

  /// Export conversation to TXT
  Future<File> exportToTXT({
    required List<ConversationMessage> messages,
    ConversationSummary? summary,
  }) async {
    final buffer = StringBuffer();

    buffer.writeln('VoiceLink Conversation');
    buffer.writeln('=' * 50);
    buffer.writeln();

    // Summary section
    if (summary != null) {
      buffer.writeln('SUMMARY');
      buffer.writeln('-' * 50);
      buffer.writeln(summary.summary);
      buffer.writeln();
      buffer.writeln('Duration: ${summary.duration}');
      buffer.writeln('Languages: ${summary.languagesDetected.join(', ')}');
      buffer.writeln();
      buffer.writeln('=' * 50);
      buffer.writeln();
    }

    buffer.writeln('CONVERSATION');
    buffer.writeln('-' * 50);
    buffer.writeln();

    for (final message in messages) {
      final role = message.speaker == 'listener' ? 'LISTENER' : 'SPEAKER';
      buffer.writeln('[$role]');
      buffer.writeln('Original [${message.detectedLanguage}]: ${message.originalText}');
      buffer.writeln('Translation: ${message.translatedText}');
      buffer.writeln('Time: ${message.timestamp.toLocal()}');
      buffer.writeln();
    }

    // Save to file
    final directory = await getApplicationDocumentsDirectory();
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final filePath = '${directory.path}/conversation_$timestamp.txt';
    final file = File(filePath);
    await file.writeAsString(buffer.toString());

    return file;
  }

  /// Share exported file
  Future<void> shareFile(File file) async {
    await Share.shareXFiles(
      [XFile(file.path)],
      subject: 'VoiceLink Conversation',
    );
  }

  /// Print PDF
  Future<void> printPDF({
    required List<ConversationMessage> messages,
    ConversationSummary? summary,
  }) async {
    final file = await exportToPDF(messages: messages, summary: summary);
    final bytes = await file.readAsBytes();
    await Printing.layoutPdf(onLayout: (_) async => bytes);
  }
}
