const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.findAll = catchAsync(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'passwordChangeAt', 'status'] },
    where: {
      status: 'active',
    },
    include: [
      {
        model: Post,
        attributes: { exclude: ['status'] },
        include: [{ model: Comment }],
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

exports.findOne = catchAsync(async (req, res) => {
  const { user } = req;

  return res.status(200).json({
    status: 'success',
    user,
  });
});

exports.update = catchAsync(async (req, res) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({
    name,
    email,
  });

  return res.status(200).json({
    status: 'succes',
    message: 'user has been updated succesfully',
  });
});

exports.delete = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({
    status: 'desabled',
  });
  return res.status(200).json({
    status: 'success',
    message: 'user has been delete succesfully',
  });
});
