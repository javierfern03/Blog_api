const express = require('express');

//CONTROLLER
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

//MIDDLEWARES
const validationMiddleware = require('../middlewares/validations.middlewares');
const userMiddleware = require('../middlewares/user.middlewares');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', userController.findAll);

router
  .route('/:id')
  .get(userMiddleware.validationUserExist, userController.findOne)
  .patch(
    userMiddleware.validationUserExist,
    authMiddleware.protectAccountOwner,
    validationMiddleware.updateValidation,
    userController.update
  )
  .delete(
    userMiddleware.validationUserExist,
    authMiddleware.protectAccountOwner,
    authMiddleware.restrictTo('admin'),
    userController.delete
  );

router.patch(
  '/password/:id',
  validationMiddleware.updatePasswordValidation,
  userMiddleware.validationUserExist,
  authMiddleware.protectAccountOwner,
  authController.updatedPassword
);

module.exports = router;
