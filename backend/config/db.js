const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the connection string in MONGO_URI.
 * The process exits if the initial connection fails so the app does
 * not run in a broken half-connected state.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI is not set. Add it to your backend/.env file.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`🍃 MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });
};

module.exports = connectDB;
