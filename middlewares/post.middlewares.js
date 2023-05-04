const Post = require('../models/post.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const PostImg = require('../models/postImg.model');
const Comment = require('../models/comment.model');

exports.validationExistMyPosts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const posts = await Post.findAll({
    where: {
      status: 'active',
      userId: sessionUser.id,
    },
    include: [
      { model: User, attributes: ['id', 'name', 'profileImgUrl'] },
      { model: PostImg },
    ],
  });

  if (!posts) {
    return next(new AppError('post not found', 404));
  }

  req.myPost = posts;
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

exports.existPostForFoundIt = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      status: 'active',
      id: id,
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['password', 'passwordChangeAt', 'role', 'status'],
        },
      },
      {
        model: PostImg,
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: {
              exclude: ['password', 'passwordChangeAt', 'role', 'status'],
            },
          },
        ],
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
