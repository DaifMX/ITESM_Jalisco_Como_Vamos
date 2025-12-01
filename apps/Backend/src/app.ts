import 'dotenv/config';
import '@/lib/register-webcrypto';

import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { auth } from '@/lib/auth';

import AnswerRouter from '@/routers/AnswerRouter';
import CategoryRouter from '@/routers/CategoryRouter';
import QuestionRouter from '@/routers/QuestionRouter';
import SystemRouter from '@/routers/SystemRouter';
import StatsRouter from '@/routers/StatsRouter';

import getTrustedOrigins from '@/utils/getTrustedOrigins';

const app = express();

const PORT = process.env.API_PORT;

app.use(morgan('tiny'));
app.use(cors({
    origin: getTrustedOrigins(),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-login", "user-agent", "cookie"],
    exposedHeaders: ["set-cookie"],
}));

app.all("/api/auth/*splat", toNodeHandler(auth)); // DON'T PLACE BEFORE app.use(express.json())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/api/answer', new AnswerRouter().getRouter());
app.use('/api/category', new CategoryRouter().getRouter());
app.use('/api/question', new QuestionRouter().getRouter());
app.use('/api/sys', new SystemRouter().getRouter());
app.use('/api/stats', new StatsRouter().getRouter());

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});
