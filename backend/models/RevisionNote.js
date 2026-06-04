const mongoose = require('mongoose');

// A revision flashcard, as created on the Revision Desk page.
const revisionNoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    keyword: { type: String, required: [true, 'Keyword / topic is required'], trim: true },
    detail: { type: String, required: [true, 'Revision detail is required'], trim: true },
    tag: {
      type: String,
      enum: ['must-revise', 'tricky', 'formula'],
      default: 'must-revise',
    },
    color: {
      type: String,
      enum: ['yellow', 'pink', 'green'],
      default: 'yellow',
    },
    date: { type: String, default: '' }, // target revision date
    time: { type: String, default: '' }, // target revision time
    resource: { type: String, default: 'None' }, // attached resource name
  },
  { timestamps: true }
);

module.exports = mongoose.model('RevisionNote', revisionNoteSchema);
