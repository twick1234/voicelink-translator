import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/conversation_provider.dart';

class RecordingButton extends StatelessWidget {
  const RecordingButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<ConversationProvider>(
      builder: (context, provider, child) {
        return GestureDetector(
          onTap: () async {
            if (provider.isListening) {
              await provider.stopListening();
            } else {
              await provider.startListening();
            }
          },
          onLongPress: () async {
            // Long press triggers stop and summarize
            await provider.stopAndSummarize();
          },
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: provider.isListening ? Colors.red : Colors.blue,
              boxShadow: [
                BoxShadow(
                  color: (provider.isListening ? Colors.red : Colors.blue)
                      .withOpacity(0.4),
                  blurRadius: 20,
                  spreadRadius: 5,
                ),
              ],
            ),
            child: Icon(
              provider.isListening ? Icons.stop : Icons.mic,
              color: Colors.white,
              size: 40,
            ),
          ),
        );
      },
    );
  }
}
