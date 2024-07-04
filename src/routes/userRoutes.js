const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidator, loginValidator } = require('../middleware/validators');

router.post('/register', registerValidator, userController.registerUser);
router.post('/login', loginValidator, userController.loginUser);

module.exports = router;