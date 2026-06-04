const mongoose = require('mongoose');

// A "topic" is a chapter / study branch that belongs to a subject.
const topicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
    },
    notes: { type: String, default: '', trim: true },
    // Free-form target date / study time slot as entered in the UI.
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    // Rough estimate (in hours) used by the study-plan generator.
    estimatedHours: { type: Number, default: 1, min: 0 },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);
