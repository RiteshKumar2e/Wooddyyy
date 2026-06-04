const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const StudyPlan = require('../models/StudyPlan');
const { generateStudyPlan } = require('../utils/studyPlanner');

// @route   GET /api/dashboard
// @access  Private  (headline numbers for the summary page)
const getSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [subjectCount, topics, quizAgg] = await Promise.all([
      Subject.countDocuments({ user: userId }),
      Topic.find({ user: userId }).select('title date done subject').lean(),
      Quiz.aggregate([
        { $match: { user: userId, status: 'completed' } },
        { $group: { _id: null, taken: { $sum: 1 }, avg: { $avg: '$score' } } },
      ]),
    ]);

    const totalTopics = topics.length;
    const completedTopics = topics.filter((t) => t.done).length;
    const overallProgress = totalTopics
      ? Math.round((completedTopics / totalTopics) * 100)
      : 0;

    // Upcoming = not done, has a date, soonest first.
    const upcoming = topics
      .filter((t) => !t.done && t.date)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .slice(0, 5);

    const recentQuizzes = await Quiz.find({ user: userId, status: 'completed' })
      .sort('-completedAt')
      .limit(5)
      .select('title subjectName type score totalQuestions completedAt')
      .lean();

    return res.json({
      subjects: subjectCount,
      topics: { total: totalTopics, completed: completedTopics },
      overallProgress,
      quizzesTaken: quizAgg[0]?.taken || 0,
      averageQuizScore: quizAgg[0] ? Math.round(quizAgg[0].avg) : 0,
      upcomingTopics: upcoming,
      recentQuizzes,
    });
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/dashboard/progress
// @access  Private  (per-subject data for the progress-chart page)
const getProgress = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [subjects, topics, quizBySubject] = await Promise.all([
      Subject.find({ user: userId }).lean(),
      Topic.find({ user: userId }).select('title done subject').lean(),
      Quiz.aggregate([
        { $match: { user: userId, status: 'completed' } },
        { $group: { _id: '$subjectName', avg: { $avg: '$score' } } },
      ]),
    ]);

    const quizAvgByName = quizBySubject.reduce((acc, r) => {
      acc[r._id] = Math.round(r.avg);
      return acc;
    }, {});

    const data = subjects.map((s) => {
      const chapters = topics.filter((t) => t.subject.toString() === s._id.toString());
      const completed = chapters.filter((c) => c.done).length;
      return {
        id: s._id,
        name: s.name,
        color: s.color,
        total: chapters.length,
        completed,
        progress: chapters.length ? Math.round((completed / chapters.length) * 100) : 0,
        quizAvg: quizAvgByName[s.name] || 0,
        weeklySessions: s.weeklySessions,
        chapters: chapters.map((c) => ({ title: c.title, done: c.done })),
      };
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

// @route   POST /api/dashboard/study-plan
// @access  Private
// Builds (and saves) a schedule from the user's pending topics.
const createStudyPlan = async (req, res, next) => {
  try {
    const { examDate, dailyHours, title } = req.body;
    if (!examDate) {
      return res.status(400).json({ message: 'examDate is required' });
    }

    // Pull pending topics with their subject names.
    const topics = await Topic.find({ user: req.user._id, done: false })
      .populate('subject', 'name')
      .lean();

    const planTopics = topics.map((t) => ({
      _id: t._id,
      title: t.title,
      subjectName: t.subject?.name || '',
      estimatedHours: t.estimatedHours,
      done: t.done,
    }));

    const schedule = generateStudyPlan({
      topics: planTopics,
      examDate: new Date(examDate),
      dailyHours: dailyHours ? Number(dailyHours) : 2,
    });

    // One plan per user: replace any previous one.
    const plan = await StudyPlan.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        title: title || 'My Study Plan',
        examDate: new Date(examDate),
        dailyHours: dailyHours ? Number(dailyHours) : 2,
        schedule,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json(plan);
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/dashboard/study-plan
// @access  Private
const getStudyPlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ user: req.user._id }).lean();
    if (!plan) {
      return res.status(404).json({ message: 'No study plan yet. Generate one first.' });
    }
    return res.json(plan);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSummary,
  getProgress,
  createStudyPlan,
  getStudyPlan,
};
