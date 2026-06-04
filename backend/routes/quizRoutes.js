const express = require('express');
const {
  createQuiz,
  getQuizzes,
  getQuiz,
  submitQuiz,
  deleteQuiz,
  getQuizStats,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats/summary', getQuizStats);
router.route('/').get(getQuizzes).post(createQuiz);
router.put('/:id/submit', submitQuiz);
router.route('/:id').get(getQuiz).delete(deleteQuiz);

module.exports = router;
