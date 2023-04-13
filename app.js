const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());

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
