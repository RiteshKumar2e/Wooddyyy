const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Subject = require('../models/Subject');

// Apply an array of answers (aligned by index with quiz.questions) and
// compute the score. Mutates the quiz document in place.
const gradeQuiz = (quiz, answers = []) => {
  let earned = 0;
  let correctCount = 0;

  quiz.questions.forEach((q, i) => {
    const a = answers[i] || {};

    if (quiz.type === 'objective') {
      q.selection = a.selection ?? null;
      q.timeout = Boolean(a.timeout);
      q.isCorrect = !q.timeout && a.selection != null && a.selection === q.correct;
      if (q.isCorrect) {
        earned += 1;
        correctCount += 1;
      }
    } else {
      q.subjectiveAnswer = a.subjectiveAnswer ?? '';
      q.selfGrade = a.selfGrade ?? 'missed';
      const weight = q.selfGrade === 'perfect' ? 1 : q.selfGrade === 'partial' ? 0.5 : 0;
      q.isCorrect = q.selfGrade === 'perfect';
      if (q.selfGrade === 'perfect') correctCount += 1;
      earned += weight;
    }
  });

  const total = quiz.questions.length;
  quiz.totalQuestions = total;
  quiz.correctCount = correctCount;
  quiz.score = total ? Math.round((earned / total) * 100) : 0;
  quiz.status = 'completed';
  quiz.completedAt = new Date();
};

// Resolve an optional subject reference to its display name.
const resolveSubjectName = async (subjectId, userId, fallback) => {
  if (!subjectId) return fallback || 'General';
  const subject = await Subject.findOne({ _id: subjectId, user: userId }).lean();
  return subject ? subject.name : fallback || 'General';
};

// @route   POST /api/quizzes
// @access  Private
// Saves a quiz. If `answers` are included it is graded and marked completed,
// otherwise it is stored as a draft.
const createQuiz = async (req, res, next) => {
  try {
    const { subject, subjectName, title, type, questions, answers } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'A quiz needs at least one question' });
    }

    const resolvedName = await resolveSubjectName(subject, req.user._id, subjectName);

    const quiz = new Quiz({
      user: req.user._id,
      subject: subject || null,
      subjectName: resolvedName,
      title: title || `${type === 'subjective' ? 'Subjective' : 'Objective'} Quiz`,
      type: type === 'subjective' ? 'subjective' : 'objective',
      questions,
    });

    if (Array.isArray(answers) && answers.length > 0) {
      gradeQuiz(quiz, answers);
    } else {
      quiz.totalQuestions = questions.length;
    }

    await quiz.save();
    return res.status(201).json(quiz);
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.subject) filter.subject = req.query.subject;

    const quizzes = await Quiz.find(filter).sort('-createdAt').lean();
    return res.json(quizzes);
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/quizzes/:id
// @access  Private
const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    return res.json(quiz);
  } catch (error) {
    return next(error);
  }
};

// @route   PUT /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'answers must be an array' });
    }

    gradeQuiz(quiz, answers);
    await quiz.save();
    return res.json(quiz);
  } catch (error) {
    return next(error);
  }
};

// @route   DELETE /api/quizzes/:id
// @access  Private
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    return res.json({ message: 'Quiz removed', id: quiz._id });
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/quizzes/stats/summary
// @access  Private  (totals + per-subject averages)
const getQuizStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [overall] = await Quiz.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: null,
          quizzesTaken: { $sum: 1 },
          averageScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
        },
      },
    ]);

    const bySubject = await Quiz.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: '$subjectName',
          quizzesTaken: { $sum: 1 },
          averageScore: { $avg: '$score' },
        },
      },
      { $project: { _id: 0, subjectName: '$_id', quizzesTaken: 1, averageScore: { $round: ['$averageScore', 0] } } },
      { $sort: { subjectName: 1 } },
    ]);

    return res.json({
      quizzesTaken: overall?.quizzesTaken || 0,
      averageScore: overall ? Math.round(overall.averageScore) : 0,
      bestScore: overall?.bestScore || 0,
      bySubject,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuiz,
  submitQuiz,
  deleteQuiz,
  getQuizStats,
};
