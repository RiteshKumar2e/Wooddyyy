const Strategy = require('../models/Strategy');

// @route   GET /api/strategies
// @access  Private
const getStrategies = async (req, res, next) => {
  try {
    const strategies = await Strategy.find({ user: req.user._id }).sort('createdAt').lean();
    return res.json(strategies);
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/strategies/:id
// @access  Private
const getStrategy = async (req, res, next) => {
  try {
    const strategy = await Strategy.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }
    return res.json(strategy);
  } catch (error) {
    return next(error);
  }
};

// @route   POST /api/strategies
// @access  Private
const createStrategy = async (req, res, next) => {
  try {
    const { subject, color, examDate, phases, tips } = req.body;
    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: 'Subject is required' });
    }

    const strategy = await Strategy.create({
      user: req.user._id,
      subject: subject.trim(),
      color,
      examDate,
      phases,
      tips,
    });

    return res.status(201).json(strategy);
  } catch (error) {
    return next(error);
  }
};

// @route   PUT /api/strategies/:id
// @access  Private
// Replaces whichever of subject/color/examDate/phases/tips are provided.
// The Exam Prep UI manages phases, tasks and tips client-side and syncs
// the full arrays back here.
const updateStrategy = async (req, res, next) => {
  try {
    const strategy = await Strategy.findOne({ _id: req.params.id, user: req.user._id });
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    const editable = ['subject', 'color', 'examDate', 'phases', 'tips'];
    for (const field of editable) {
      if (req.body[field] !== undefined) strategy[field] = req.body[field];
    }

    await strategy.save();
    return res.json(strategy);
  } catch (error) {
    return next(error);
  }
};

// @route   PATCH /api/strategies/:id/phases/:phaseId/toggle
// @access  Private  (flip a single phase's completion state)
const togglePhase = async (req, res, next) => {
  try {
    const strategy = await Strategy.findOne({ _id: req.params.id, user: req.user._id });
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    const phase = strategy.phases.id(req.params.phaseId);
    if (!phase) {
      return res.status(404).json({ message: 'Phase not found' });
    }

    phase.done = !phase.done;
    await strategy.save();
    return res.json(strategy);
  } catch (error) {
    return next(error);
  }
};

// @route   DELETE /api/strategies/:id
// @access  Private
const deleteStrategy = async (req, res, next) => {
  try {
    const strategy = await Strategy.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }
    return res.json({ message: 'Strategy removed', id: strategy._id });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStrategies,
  getStrategy,
  createStrategy,
  updateStrategy,
  togglePhase,
  deleteStrategy,
};
