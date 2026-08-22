import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import matchRouter from './api/match';
import { PORT, MAX_BODY_SIZE } from './constants';

// Load environment variables from .env file
dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: MAX_BODY_SIZE }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api', matchRouter);

/** Health check endpoint */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Static files (production) ──────────────────────────────────────────────
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));

/** SPA fallback — serve index.html for all non-API routes */
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ── Error handling ─────────────────────────────────────────────────────────

/** Global error handler — ensures the server never crashes on unhandled errors */
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[lublue] Server running on port ${PORT}`);
});
