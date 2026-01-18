import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/conversation_provider.dart';

class ExportMenu extends StatelessWidget {
  const ExportMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.download),
      tooltip: 'Export Conversation',
      onSelected: (value) async {
        final provider = context.read<ConversationProvider>();

        if (provider.messages.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('No conversation to export'),
              duration: Duration(seconds: 2),
            ),
          );
          return;
        }

        switch (value) {
          case 'pdf':
            await provider.exportToPDF();
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Exported as PDF'),
                  duration: Duration(seconds: 2),
                ),
              );
            }
            break;
          case 'txt':
            await provider.exportToTXT();
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Exported as TXT'),
                  duration: Duration(seconds: 2),
                ),
              );
            }
            break;
          case 'summarize':
            await provider.stopAndSummarize();
            break;
        }
      },
      itemBuilder: (context) => [
        const PopupMenuItem(
          value: 'pdf',
          child: Row(
            children: [
              Icon(Icons.picture_as_pdf, color: Colors.red),
              SizedBox(width: 8),
              Text('Export as PDF'),
            ],
          ),
        ),
        const PopupMenuItem(
          value: 'txt',
          child: Row(
            children: [
              Icon(Icons.text_snippet, color: Colors.blue),
              SizedBox(width: 8),
              Text('Export as TXT'),
            ],
          ),
        ),
        const PopupMenuDivider(),
        const PopupMenuItem(
          value: 'summarize',
          child: Row(
            children: [
              Icon(Icons.summarize, color: Colors.orange),
              SizedBox(width: 8),
              Text('Generate Summary'),
            ],
          ),
        ),
      ],
    );
  }
}
