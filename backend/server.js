require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ── Database ──────────────────────────────────────────────
connectDB();

// ── Global middleware ─────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    // Allow any origin in dev when none is configured; otherwise restrict.
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'woody-backend', time: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/revision', require('./routes/revisionRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/strategies', require('./routes/strategyRoutes'));

// ── 404 (no route matched) ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Central error handler ─────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Mongoose validation / cast errors map to 400, everything else to 500.
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value violates a unique field' });
  }

  console.error('💥 Unhandled error:', err);
  const status = err.statusCode || 500;
  return res.status(status).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Woody backend listening on http://localhost:${PORT}`);
});

module.exports = app;
