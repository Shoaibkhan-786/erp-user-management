import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import { ValidationError } from 'express-validation';

import passportConfig from './config/passport.js';
import indexRoute from './routes/index.js';

const app = express();

passportConfig();
app.use(passport.initialize());

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res, next) => {
  res.json({ status: 200, message: "Hello, Welcome to ERP management system" });
});

app.use(indexRoute);

app.use((err, req, res, next) => {
  const { statusCode } = err;
  if (err instanceof ValidationError) {
    const message = err.details.body?.[0]?.message || err.details.query?.[0]?.message;
    return res.status(statusCode).json({ error: message || 'Validation error' });
  } else {
    const { status = 500, message = "Internal Server Error" } = err;
    res.status(status).json({ message });
  }
});

export default app;
