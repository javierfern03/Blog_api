const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('helmet');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requst from this IP, Plase try again in one hour!',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(xss());

app.use('/api/v1', limiter);

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`cannot find ${req.originalUrl} on thid server1! `, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
