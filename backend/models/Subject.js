const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [80, 'Subject name cannot exceed 80 characters'],
    },
    // Hex colour used to theme the subject in the UI.
    color: {
      type: String,
      default: '#E6A817',
      trim: true,
    },
    // Weekly study hours (Mon..Sun) powering the progress-chart bar graph.
    weeklySessions: {
      type: [Number],
      default: () => [0, 0, 0, 0, 0, 0, 0],
      validate: {
        validator: (arr) => arr.length === 7,
        message: 'weeklySessions must contain exactly 7 values (Mon..Sun)',
      },
    },
  },
  { timestamps: true }
);

// A user cannot have two subjects with the same name.
subjectSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
