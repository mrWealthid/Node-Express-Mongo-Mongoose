const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
const {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
