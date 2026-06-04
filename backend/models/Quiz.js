const mongoose = require('mongoose');

// One question inside a quiz, together with the answer the user gave.
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    // Objective questions carry options + the index of the correct one.
    options: { type: [String], default: undefined },
    correct: { type: Number, default: null },
    // Subjective questions carry a reference answer instead.
    sampleAnswer: { type: String, default: '' },
    explanation: { type: String, default: '' },

    // ── The user's response (filled in on submit) ──
    selection: { type: Number, default: null }, // objective: chosen index
    subjectiveAnswer: { type: String, default: '' },
    selfGrade: {
      type: String,
      enum: ['perfect', 'partial', 'missed', null],
      default: null,
    },
    isCorrect: { type: Boolean, default: false },
    timeout: { type: Boolean, default: false },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Optional link to a Subject document; subjectName is always stored
    // so quizzes survive even if the subject is later deleted.
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    subjectName: { type: String, default: 'General', trim: true },
    title: { type: String, default: 'Untitled Quiz', trim: true },
    type: {
      type: String,
      enum: ['objective', 'subjective'],
      default: 'objective',
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'A quiz must have at least one question',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'completed'],
      default: 'draft',
    },
    // Computed on submit.
    score: { type: Number, default: 0 }, // percentage 0..100
    totalQuestions: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
