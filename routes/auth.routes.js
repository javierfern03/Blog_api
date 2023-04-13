const express = require('express');

//CONTROLLER
const authController = require('../controllers/auth.controller');

//MIDDLEWARES
const validations = require('../middlewares/validations.middlewares');

const router = express.Router();

router.post('/signup', validations.createUserValidation, authController.signup);

router.post('/login', validations.loginUserValidation, authController.login);

module.exports = router;
