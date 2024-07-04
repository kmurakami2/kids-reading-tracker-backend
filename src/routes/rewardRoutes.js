const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const authMiddleware = require('../middleware/auth');
const { rewardValidator } = require('../middleware/validators');

router.use(authMiddleware);

router.post('/', rewardValidator, rewardController.addReward);

router.get('/', rewardController.getRewards);

module.exports = router;