const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const asyncHandler = require('../utils/asyncHandler');

// Build a { subjectId: { total, done } } map of topic counts for a user.
const topicCountsBySubject = async (userId) => {
  const rows = await Topic.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$subject',
        total: { $sum: 1 },
        done: { $sum: { $cond: ['$done', 1, 0] } },
      },
    },
  ]);

  return rows.reduce((acc, r) => {
    acc[r._id.toString()] = { total: r.total, done: r.done };
    return acc;
  }, {});
};

const withProgress = (subject, counts) => {
  const c = counts[subject._id.toString()] || { total: 0, done: 0 };
  const progress = c.total ? Math.round((c.done / c.total) * 100) : 0;
  return {
    ...subject,
    totalChapters: c.total,
    completedChapters: c.done,
    progress,
  };
};

// @route   GET /api/subjects
// @access  Private
const getSubjects = asyncHandler(async (req, res) => {
  const [subjects, counts] = await Promise.all([
    Subject.find({ user: req.user._id }).sort('-createdAt').lean(),
    topicCountsBySubject(req.user._id),
  ]);

  return res.json(subjects.map((s) => withProgress(s, counts)));
});

// @route   GET /api/subjects/:id
// @access  Private  (subject + its topics/chapters)
const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  const chapters = await Topic.find({ subject: subject._id, user: req.user._id })
    .sort('createdAt')
    .lean();

  const done = chapters.filter((c) => c.done).length;
  const progress = chapters.length ? Math.round((done / chapters.length) * 100) : 0;

  return res.json({
    ...subject,
    chapters,
    totalChapters: chapters.length,
    completedChapters: done,
    progress,
  });
});

// @route   POST /api/subjects
// @access  Private
const createSubject = asyncHandler(async (req, res) => {
  const { name, color, weeklySessions } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Subject name is required' });
  }

  const subject = await Subject.create({
    user: req.user._id,
    name: name.trim(),
    color,
    weeklySessions,
  });

  return res.status(201).json(withProgress(subject.toObject(), {}));
});

// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = asyncHandler(async (req, res) => {
  const { name, color, weeklySessions } = req.body;
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  if (name !== undefined) subject.name = name;
  if (color !== undefined) subject.color = color;
  if (weeklySessions !== undefined) subject.weeklySessions = weeklySessions;

  await subject.save();
  return res.json(subject);
});

// @route   DELETE /api/subjects/:id
// @access  Private  (also removes the subject's topics)
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  await Topic.deleteMany({ subject: subject._id, user: req.user._id });

  return res.json({ message: 'Subject and its topics removed', id: subject._id });
});

module.exports = {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
};
