import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'services/api_service.dart';
import 'services/speech_recognition_service.dart';
import 'services/export_service.dart';
import 'services/conversation_provider.dart';
import 'screens/conversation_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await dotenv.load(fileName: ".env");

  runApp(const VoiceLinkApp());
}

class VoiceLinkApp extends StatelessWidget {
  const VoiceLinkApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Initialize services
    final apiService = ApiService(
      baseUrl: dotenv.env['API_BASE_URL'] ?? 'http://localhost:3000',
    );

    final speechService = SpeechRecognitionService();
    final exportService = ExportService();

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => ConversationProvider(
            apiService: apiService,
            speechService: speechService,
            exportService: exportService,
          ),
        ),
      ],
      child: MaterialApp(
        title: 'VoiceLink Translator',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.blue,
            brightness: Brightness.light,
          ),
          useMaterial3: true,
          appBarTheme: const AppBarTheme(
            centerTitle: true,
            elevation: 2,
          ),
        ),
        darkTheme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.blue,
            brightness: Brightness.dark,
          ),
          useMaterial3: true,
        ),
        themeMode: ThemeMode.system,
        home: const ConversationScreen(),
      ),
    );
  }
}
