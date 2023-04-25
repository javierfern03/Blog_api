const express = require('express');

//CONTROLLERS
const postController = require('../controllers/post.controllers');

//MIDDLEWARES
const authMiddleware = require('../middlewares/auth.middleware');
const validationsMiddlewares = require('../middlewares/validations.middlewares');
const postMiddlewares = require('../middlewares/post.middlewares');
const userMiddlewares = require('../middlewares/user.middlewares');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(postController.findAllPost)
  .post(validationsMiddlewares.createPostValidation, postController.createPost);

router.get(
  '/me',
  postMiddlewares.validationExistMyPosts,
  postController.findMyPost
);

router.get(
  '/profile/:id',
  userMiddlewares.validationUserExist,
  postController.findUserPost
);

router
  .use('/:id', postMiddlewares.validationExistPost)
  .route('/:id')
  .get(postController.findOnePost)
  .patch(
    validationsMiddlewares.createPostValidation,
    authMiddleware.protectAccountOwner,
    postController.updatePost
  )
  .delete(
    validationsMiddlewares.createPostValidation,
    authMiddleware.protectAccountOwner,
    postController.deletePost
  );

module.exports = router;
