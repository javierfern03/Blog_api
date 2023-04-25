const Comment = require('../models/comment.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.commentExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({
    where: {
      status: 'active',
      id,
    },
  });

  if (!comment) {
    return next(new AppError(`Comment with id: ${id} not fount`, 404));
  }

  req.comment = comment;
  next();
});
