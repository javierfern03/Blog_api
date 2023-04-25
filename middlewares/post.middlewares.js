const Post = require('../models/post.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validationExistMyPosts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const posts = await Post.findAll({
    where: {
      status: 'active',
      userId: sessionUser.id,
    },
  });

  if (!posts) {
    return next(new AppError('post not found', 404));
  }

  req.posts = posts;
  next();
});

exports.validationExistPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      status: 'active',
      id: id,
    },
    include: [
      {
        model: User,
      },
    ],
  });

  if (!post) {
    return next(new AppError('post not found', 404));
  }

  req.post = post;
  req.user = post.user;
  next();
});
