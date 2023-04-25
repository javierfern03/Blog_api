const Post = require('../models/post.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment.model');

exports.findAllPost = catchAsync(async (req, res) => {
  const post = await Post.findAll({
    where: {
      status: 'active',
    },
    attributes: {
      exclude: ['userId', 'status'],
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl'],
      },
      {
        model: Comment,
        attributes: ['Text', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['name', 'profileImgUrl'],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  res.status(200).json({
    status: 'success',
    results: post.length,
    post,
  });
});

exports.createPost = catchAsync(async (req, res) => {
  const { title, content } = req.body;
  const { sessionUser } = req;

  const post = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'The post has been created',
    post,
  });
});

exports.findMyPost = catchAsync(async (req, res) => {
  const { post } = req;

  res.status(200).json({
    status: 'success',
    post: post,
  });
});

exports.findUserPost = catchAsync(async (req, res) => {
  const { user } = req;
  const posts = await Post.findAll({
    where: {
      userId: user.id,
      status: 'active',
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'passwordChangeAt'] },
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

exports.findOnePost = catchAsync(async (req, res) => {
  const { post } = req;

  res.status(200).json({
    status: 'success',
    post,
  });
});

exports.updatePost = catchAsync(async (req, res) => {
  const { post } = req;
  const { title, content } = req.body;

  await post.update({
    title: title,
    content: content,
  });

  res.status(200).json({
    status: 'success',
    message: 'The post has been updated',
  });
});

exports.deletePost = catchAsync(async (req, res) => {
  const { post } = req;

  await post.update({
    status: 'desabled',
  });

  res.status(200).json({
    status: 'success',
    message: 'post has been delete successfully',
  });
});
