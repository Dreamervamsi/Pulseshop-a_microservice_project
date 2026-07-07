import express from "express";
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { errMiddeware } from "@pulseshop/shared/error-middleware";

const app = express();

app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// routes
app.use('/auth/', authRouter);

// middlewares
app.use(errMiddeware);

export default app;