const express = require('express');

//CONTROLLERS
const commentController = require('../controllers/comment.controller');

//MIDDLEWARES
const authMiddleware = require('../middlewares/auth.middleware');
const commentMiddleware = require('../middlewares/comment.middleware');
const validationMiddleware = require('../middlewares/validations.middlewares');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', commentController.findAllCommnent);

router.post('/:postId', commentController.createComment);

router
  .use('/:id', commentMiddleware.commentExist)
  .route('/:id')
  .get(commentController.findCommentById)
  .patch(
    validationMiddleware.validContentComment,
    commentController.updateComment
  )
  .delete(
    validationMiddleware.validContentComment,
    commentController.deleteComment
  );

module.exports = router;
