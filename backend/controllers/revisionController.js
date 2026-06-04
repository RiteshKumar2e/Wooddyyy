const RevisionNote = require('../models/RevisionNote');

// @route   GET /api/revision
// @access  Private   (?tag=must-revise|tricky|formula, ?subject=Name filters)
const getNotes = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.tag && req.query.tag !== 'all') filter.tag = req.query.tag;
    if (req.query.subject) filter.subject = req.query.subject;

    const notes = await RevisionNote.find(filter).sort('-createdAt').lean();
    return res.json(notes);
  } catch (error) {
    return next(error);
  }
};

// @route   POST /api/revision
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { subject, keyword, detail, tag, color, date, time, resource } = req.body;

    if (!subject || !keyword || !detail) {
      return res.status(400).json({ message: 'subject, keyword and detail are required' });
    }

    const note = await RevisionNote.create({
      user: req.user._id,
      subject,
      keyword,
      detail,
      tag,
      color,
      date,
      time,
      resource,
    });

    return res.status(201).json(note);
  } catch (error) {
    return next(error);
  }
};

// @route   PUT /api/revision/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await RevisionNote.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Revision note not found' });
    }

    const editable = ['subject', 'keyword', 'detail', 'tag', 'color', 'date', 'time', 'resource'];
    for (const field of editable) {
      if (req.body[field] !== undefined) note[field] = req.body[field];
    }

    await note.save();
    return res.json(note);
  } catch (error) {
    return next(error);
  }
};

// @route   DELETE /api/revision/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await RevisionNote.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Revision note not found' });
    }
    return res.json({ message: 'Revision note removed', id: note._id });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
