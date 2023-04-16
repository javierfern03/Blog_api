const express = require('express');

const router = express.Router();

//CONTROLLERS
const postController = require('../controllers/post.controllers');

//MIDDLEWARES
const authMiddleware = require('../middlewares/auth.middleware');

app.use(authMiddleware.protect);

router
  .route('/')
  .get(postController.findAllPost)
  .post(postController.createPost);

router('/me', postController.findMyPost);
router('/profile/:id', postController.findUserPost);

router
  .route('/:id')
  .get(postController.findOnePost)
  .patch(authMiddleware.protectAccountOwner, postController.updatePost)
  .delete(authMiddleware.protectAccountOwner, postController.deletePost);
