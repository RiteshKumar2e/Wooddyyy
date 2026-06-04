const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// Confirm the subject exists and belongs to the requesting user.
const findOwnedSubject = (subjectId, userId) =>
  Subject.findOne({ _id: subjectId, user: userId });

// @route   GET /api/topics            (all topics for the user)
// @route   GET /api/topics?subject=ID (topics for one subject)
// @access  Private
const getTopics = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.done !== undefined) filter.done = req.query.done === 'true';

    const topics = await Topic.find(filter).sort('createdAt').lean();
    return res.json(topics);
  } catch (error) {
    return next(error);
  }
};

// @route   POST /api/topics
// @access  Private
const createTopic = async (req, res, next) => {
  try {
    const { subject, title, notes, date, time, estimatedHours } = req.body;

    if (!subject || !title || !title.trim()) {
      return res.status(400).json({ message: 'subject and title are required' });
    }

    const ownedSubject = await findOwnedSubject(subject, req.user._id);
    if (!ownedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const topic = await Topic.create({
      user: req.user._id,
      subject,
      title: title.trim(),
      notes,
      date,
      time,
      estimatedHours,
    });

    return res.status(201).json(topic);
  } catch (error) {
    return next(error);
  }
};

// @route   PUT /api/topics/:id
// @access  Private  (edit fields or toggle "done")
const updateTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, user: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const editable = ['title', 'notes', 'date', 'time', 'estimatedHours', 'done'];
    for (const field of editable) {
      if (req.body[field] !== undefined) topic[field] = req.body[field];
    }

    await topic.save();
    return res.json(topic);
  } catch (error) {
    return next(error);
  }
};

// @route   PATCH /api/topics/:id/toggle
// @access  Private  (flip completion state)
const toggleTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, user: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topic.done = !topic.done;
    await topic.save();
    return res.json(topic);
  } catch (error) {
    return next(error);
  }
};

// @route   DELETE /api/topics/:id
// @access  Private
const deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    return res.json({ message: 'Topic removed', id: topic._id });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTopics,
  createTopic,
  updateTopic,
  toggleTopic,
  deleteTopic,
};
