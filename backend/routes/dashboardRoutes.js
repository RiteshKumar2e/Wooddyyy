const express = require('express');
const {
  getSummary,
  getProgress,
  createStudyPlan,
  getStudyPlan,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getSummary);
router.get('/progress', getProgress);
router.route('/study-plan').get(getStudyPlan).post(createStudyPlan);

module.exports = router;
