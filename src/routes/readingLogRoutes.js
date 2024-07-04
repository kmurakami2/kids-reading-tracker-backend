const express = require('express');
const router = express.Router();
const readingLogController = require('../controllers/readingLogController');
const authMiddleware = require('../middleware/auth');
const { readingLogValidator } = require('../middleware/validators');

router.use(authMiddleware);

router.post('/', readingLogValidator, readingLogController.addReadingLog);
router.get('/', readingLogController.getReadingLogs);
router.put('/:id', readingLogValidator, readingLogController.updateReadingLog);
router.delete('/:id', readingLogController.deleteReadingLog);

module.exports = router;