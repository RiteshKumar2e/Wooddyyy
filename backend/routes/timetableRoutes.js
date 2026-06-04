const express = require('express');
const {
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock,
} = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getBlocks).post(createBlock);
router.route('/:id').put(updateBlock).delete(deleteBlock);

module.exports = router;
