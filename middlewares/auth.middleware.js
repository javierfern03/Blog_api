const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');

exports.protect = catchAsync(async (req, res, next) => {
  //1. extraer el token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //2. validar si existe el token
  if (!token) {
    return next(
      new appError('Ypu are not logged in!, Please log in to get access', 401)
    );
  }

  //3. decodificar el jwt
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new appError('The owner if this token it not longer available', 401)
    );
  }

  // if(user.passwordChangeAt){
  //   const changedTimeStamp = c
  // }

  req.sessionUser = user;
  next();
});
