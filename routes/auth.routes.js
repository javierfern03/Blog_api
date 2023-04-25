const express = require('express');

//CONTROLLER
const authController = require('../controllers/auth.controller');

//MIDDLEWARES
const validations = require('../middlewares/validations.middlewares');
const authMiddleware = require('../middlewares/auth.middleware');
const { upload } = require('../utils/multer');

const router = express.Router();

router.post(
  '/signup',
  upload.single('profileImgUrl'),
  validations.createUserValidation,
  authController.signup
);

router.post('/login', validations.loginUserValidation, authController.login);

router.use(authMiddleware.protect);

router.get('/renew', authController.renew);

module.exports = router;
