const express = require('express');
const {
  getStrategies,
  getStrategy,
  createStrategy,
  updateStrategy,
  togglePhase,
  deleteStrategy,
} = require('../controllers/strategyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getStrategies).post(createStrategy);
router.patch('/:id/phases/:phaseId/toggle', togglePhase);
router.route('/:id').get(getStrategy).put(updateStrategy).delete(deleteStrategy);

module.exports = router;
