const express = require('express');

//CONTROLLERS
const postController = require('../controllers/post.controllers');

//MIDDLEWARES
const authMiddleware = require('../middlewares/auth.middleware');
const validationsMiddlewares = require('../middlewares/validations.middlewares');
const postMiddlewares = require('../middlewares/post.middlewares');
const userMiddlewares = require('../middlewares/user.middlewares');

//UTILS
const { upload } = require('../utils/multer');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(postController.findAllPost)
  .post(
    upload.array('postImgs', 3),
    validationsMiddlewares.createPostValidation,
    postController.createPost
  );

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
  .route('/:id')
  .get(postMiddlewares.existPostForFoundIt, postController.findOnePost)
  .patch(
    validationsMiddlewares.createPostValidation,
    postMiddlewares.validationExistPost,
    authMiddleware.protectAccountOwner,
    postController.updatePost
  )
  .delete(
    validationsMiddlewares.createPostValidation,
    postMiddlewares.validationExistPost,
    authMiddleware.protectAccountOwner,
    postController.deletePost
  );

module.exports = router;
