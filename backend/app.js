import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import noteRouter from './routes/note.routes.js';
import connectToDatabase from './database/mongodb.js';
import authorize from './middleware/auth.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';
import { processEmailJobs, startReminderService } from './services/reminder.service.js';

const app = express();

const defaultFrontendOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const frontendOrigins = allowedOrigins.length > 0 ? allowedOrigins : defaultFrontendOrigins;

const corsMiddleware = (req, res, next) => {
    const requestOrigin = req.headers.origin;

    if (requestOrigin && (frontendOrigins.includes(requestOrigin) || requestOrigin.endsWith('.vercel.app'))) {
        res.header('Access-Control-Allow-Origin', requestOrigin);
        res.header('Vary', 'Origin');
    }

    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    return next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(corsMiddleware);

app.use('/auth', authRouter);
app.use('/user', authorize, userRouter);
app.use('/notes', authorize, noteRouter);

const extractJobTokensFromRequest = (req) => {
    const headerToken = req.headers['x-job-secret'];
    const queryToken = req.query?.secret;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;

    return [headerToken, queryToken, bearerToken].filter(Boolean);
};

const isAuthorizedJobTrigger = (req, validTokens) => {
    const providedTokens = extractJobTokensFromRequest(req);
    return providedTokens.some((token) => validTokens.includes(token));
};

const handleProcessEmails = async (req, res) => {
    const validTokens = [process.env.JOB_SECRET, process.env.CRON_SECRET].filter(Boolean);

    if (validTokens.length === 0) {
        return res.status(503).json({
            success: false,
            message: 'Background jobs are not configured. Set JOB_SECRET or CRON_SECRET.'
        });
    }

    if (!isAuthorizedJobTrigger(req, validTokens)) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized job trigger. Provide x-job-secret, ?secret=, or Authorization: Bearer <secret>.'
        });
    }

    try {
        const result = await processEmailJobs();
        return res.status(200).json({
            success: true,
            ...result
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: 'Failed to process email jobs',
            error: e.message
        });
    }
};

app.post('/jobs/process-emails', handleProcessEmails);
app.get('/jobs/process-emails', handleProcessEmails);

// health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
})

// root endpoint - api information
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Tether Note\'s API',
        endpoints: {
            auth: {
                signUp: 'POST /auth/sign-up',
                signIn: 'POST /auth/sign-in',
                signOut: 'POST /auth/sign-out'
            },
            users: {
                getUser: 'GET /user (requires auth)',
                updateUser: 'PUT /user (requires auth)'
            },
            notes: {
                getAllNotes: 'GET /notes (requires auth)',
                createNote: 'POST /notes (requires auth)',
                getNote: 'GET /notes/:id (requires auth)',
                deleteNote: 'DELETE /notes/:id (requires auth)'
            },
            system: {
                health: 'GET /health',
                processEmails: 'POST|GET /jobs/process-emails (JOB_SECRET / CRON_SECRET required)'
            }
        }
    })
});



app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    await connectToDatabase();
    startReminderService();
  });
} else {
  connectToDatabase();
  if (!process.env.VERCEL) {
    startReminderService();
  }
}
export default app;
