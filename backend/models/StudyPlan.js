const mongoose = require('mongoose');

// A single scheduled study session produced by the planner.
const sessionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    day: { type: String, default: '' }, // Mon, Tue, ...
    subjectName: { type: String, default: '' },
    topic: { type: String, required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
    durationHours: { type: Number, default: 1 },
    done: { type: Boolean, default: false },
  },
  { _id: true }
);

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, default: 'My Study Plan', trim: true },
    examDate: { type: Date, required: true },
    dailyHours: { type: Number, default: 2, min: 0.5 },
    schedule: { type: [sessionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
