const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //Execute Query
  const users = await User.find();

  //Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'Route Not Implemented Yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'Route Not Implemented Yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'Route Not Implemented Yet',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'Route Not Implemented Yet',
  });
};
