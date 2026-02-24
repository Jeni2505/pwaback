import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => 
  res.json({ ok: true, name: 'Jenifer Todo API' })
);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

export default app;