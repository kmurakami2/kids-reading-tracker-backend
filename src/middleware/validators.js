const { body } = require('express-validator');

exports.registerValidator = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.readingLogValidator = [
  body('book_title').notEmpty().withMessage('Book title is required'),
  body('pages_read').isInt({ min: 1 }).withMessage('Pages read must be a positive integer'),
  body('minutes_read').isInt({ min: 1 }).withMessage('Minutes read must be a positive integer'),
  body('date').isISO8601().toDate().withMessage('Invalid date format')
];

exports.rewardValidator = [
  body('name').notEmpty().withMessage('Reward name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('points_required').isInt({ min: 1 }).withMessage('Points required must be a positive integer')
];