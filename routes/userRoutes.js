const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
const {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, updateMe);
router.delete('/deleteMe', authController.protect, deleteMe);

router.route('/').get(getAllUsers);
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deleteUser
  );
module.exports = router;
