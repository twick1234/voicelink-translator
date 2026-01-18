import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import translationController from './controllers/translationController';
import speechController from './controllers/speechController';
import summarizationController from './controllers/summarizationController';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Translation routes
app.post('/api/translate', (req, res) => translationController.translate(req, res));
app.post('/api/detect-language', (req, res) => translationController.detectLanguage(req, res));
app.get('/api/supported-languages', (req, res) => translationController.getSupportedLanguages(req, res));
app.post('/api/batch-translate', (req, res) => translationController.batchTranslate(req, res));

// Speech routes
app.post('/api/speech-to-text', (req, res) => speechController.speechToText(req, res));
app.post('/api/detect-audio-language', (req, res) => speechController.detectAudioLanguage(req, res));
app.get('/api/speech/health', (req, res) => speechController.healthCheck(req, res));

// Summarization routes
app.post('/api/summarize', (req, res) => summarizationController.summarizeConversation(req, res));
app.get('/api/summarize/health', (req, res) => summarizationController.healthCheck(req, res));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export for Vercel
export default app;
