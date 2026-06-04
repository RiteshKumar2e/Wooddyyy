const mongoose = require('mongoose');

// One phase of an exam-prep roadmap (e.g. "Foundation Building").
const phaseSchema = new mongoose.Schema(
  {
    phase: { type: String, required: true, trim: true },
    weeks: { type: String, default: '' }, // e.g. "Weeks 1-2"
    tasks: { type: [String], default: [] },
    done: { type: Boolean, default: false },
  },
  { _id: true }
);

// An exam preparation strategy for a subject, shown on the Exam Prep page.
const strategySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    color: { type: String, default: '#E6A817', trim: true },
    examDate: { type: String, default: '' }, // YYYY-MM-DD as entered in the UI
    phases: { type: [phaseSchema], default: [] },
    tips: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Strategy', strategySchema);
