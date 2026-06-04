const TimeBlock = require('../models/TimeBlock');

// @route   GET /api/timetable
// @access  Private   (?day=Monday filter)
const getBlocks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.day) filter.day = req.query.day;

    const blocks = await TimeBlock.find(filter).lean();
    return res.json(blocks);
  } catch (error) {
    return next(error);
  }
};

// @route   POST /api/timetable
// @access  Private
const createBlock = async (req, res, next) => {
  try {
    const { day, start, end, subject, note } = req.body;

    if (!day || !start || !end) {
      return res.status(400).json({ message: 'day, start and end are required' });
    }

    const block = await TimeBlock.create({
      user: req.user._id,
      day,
      start,
      end,
      subject,
      note,
    });

    return res.status(201).json(block);
  } catch (error) {
    return next(error);
  }
};

// @route   PUT /api/timetable/:id
// @access  Private
const updateBlock = async (req, res, next) => {
  try {
    const block = await TimeBlock.findOne({ _id: req.params.id, user: req.user._id });
    if (!block) {
      return res.status(404).json({ message: 'Time block not found' });
    }

    const editable = ['day', 'start', 'end', 'subject', 'note'];
    for (const field of editable) {
      if (req.body[field] !== undefined) block[field] = req.body[field];
    }

    await block.save();
    return res.json(block);
  } catch (error) {
    return next(error);
  }
};

// @route   DELETE /api/timetable/:id
// @access  Private
const deleteBlock = async (req, res, next) => {
  try {
    const block = await TimeBlock.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!block) {
      return res.status(404).json({ message: 'Time block not found' });
    }
    return res.json({ message: 'Time block removed', id: block._id });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getBlocks, createBlock, updateBlock, deleteBlock };
