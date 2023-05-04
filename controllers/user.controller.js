const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { ref, getDownloadURL } = require('firebase/storage');
const { storage } = require('../utils/firebase');

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

  const userPromises = users.map(async (user) => {
    const imgRef = ref(storage, user.profileImgUrl);
    const url = await getDownloadURL(imgRef);

    user.profileImgUrl = url;

    return user;
  });

  const userResolved = await Promise.all(userPromises);

  return res.status(200).json({
    status: 'success',
    results: users.length,
    users: userResolved,
  });
});

exports.findOne = catchAsync(async (req, res) => {
  const { user } = req;

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  user.profileImgUrl = url;

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
