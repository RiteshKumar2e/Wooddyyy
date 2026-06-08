const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * - In any environment: tries MONGO_URI from .env first.
 * - In development: if Atlas is unreachable, falls back to an
 *   in-memory MongoDB instance (mongodb-memory-server) so the
 *   app can run without a live Atlas cluster.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const isDev = (process.env.NODE_ENV || 'development') === 'development';

  // ── 1. Try Atlas (or whatever MONGO_URI is set to) ──────────
  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });
      console.log(`🍃 MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      mongoose.connection.on('disconnected', () =>
        console.warn('⚠️  MongoDB disconnected')
      );
      return; // success – use Atlas
    } catch (err) {
      console.error(`❌ Atlas connection failed: ${err.message}`);
      if (!isDev) {
        // In production we must not fall back silently.
        console.error('🚫 Cannot start without a database in production. Fix MONGO_URI.');
        process.exit(1);
      }
      console.warn('⚠️  Falling back to in-memory MongoDB for development…');
    }
  } else {
    console.warn('⚠️  MONGO_URI not set – using in-memory MongoDB for development.');
  }

  // ── 2. Dev fallback: mongodb-memory-server ──────────────────
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();

    await mongoose.connect(memUri);
    console.log('🧪 Using in-memory MongoDB (data resets on restart)');
    console.log('   To persist data, fix your Atlas connection:');
    console.log('   → cloud.mongodb.com → Security → Network Access → Add IP');
    console.log('   → Or resume a paused cluster on the Atlas dashboard');

    // Keep the mongod instance alive for the process lifetime.
    process.on('exit', () => mongod.stop());
    process.on('SIGINT', async () => { await mongod.stop(); process.exit(0); });
  } catch (fallbackErr) {
    console.error(`❌ In-memory MongoDB also failed: ${fallbackErr.message}`);
    console.error('   Install it manually: npm install --save-dev mongodb-memory-server');
  }
};

module.exports = connectDB;
