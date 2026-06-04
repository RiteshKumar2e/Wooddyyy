const express = require('express');
const {
  getTopics,
  createTopic,
  updateTopic,
  toggleTopic,
  deleteTopic,
} = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getTopics).post(createTopic);
router.patch('/:id/toggle', toggleTopic);
router.route('/:id').put(updateTopic).delete(deleteTopic);

module.exports = router;
