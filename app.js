import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import ErrorMiddleware from './middlewares/Error.js';

config({
  path: './config/config.env',
});
const app = express();

// Using Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Importing & Using Routes
import course from './routes/courseRoutes.js';
import other from './routes/otherRoutes.js';
import payment from './routes/paymentRoutes.js';
import user from './routes/userRoutes.js';

app.use('/api/v1', course);
app.use('/api/v1', user);
app.use('/api/v1', payment);
app.use('/api/v1', other);

export default app;

app.get('/', (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);

app.use(ErrorMiddleware);
