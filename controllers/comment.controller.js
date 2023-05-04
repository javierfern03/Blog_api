const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment.model');

exports.findAllCommnent = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    where: {
      status: 'active',
    },
  });

  res.status(200).json({
    status: 'succcess',
    comments,
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const { sessionUser } = req;

  const comment = await Comment.create({
    postId,
    text,
    userId: sessionUser.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'The comment has been created successfully',
    comment,
  });
});

exports.findCommentById = catchAsync(async (req, res, next) => {
  const { comment } = req;

  res.status(200).json({
    status: 'success',
    comment,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req;
  const { text } = req.body;

  await comment.update({
    text,
  });

  res.status(200).json({
    status: 'success',
    message: 'The comment has been updated',
    comment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({
    status: 'desabled',
  });

  res.status(200).json({
    status: 'success',
    message: 'The comment has been delete successfully',
  });
});
