const mongoose = require('mongoose');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CATEGORIES = ['Focus', 'Practice', 'Notes', 'Review', 'Break', 'CatchUp'];

// A single focus/break block on the weekly timetable.
const timeBlockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    day: {
      type: String,
      enum: DAYS,
      required: [true, 'Day is required'],
    },
    start: { type: String, required: [true, 'Start time is required'] },
    end: { type: String, required: [true, 'End time is required'] },
    subject: {
      type: String,
      enum: CATEGORIES,
      default: 'Focus',
    },
    note: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeBlock', timeBlockSchema);
module.exports.DAYS = DAYS;
module.exports.CATEGORIES = CATEGORIES;
