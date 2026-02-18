import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import noteRouter from './routes/note.routes.js';
import connectToDatabase from './database/mongodb.js';
import authorize from './middleware/auth.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';
import { startReminderService } from './services/reminder.service.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/user', authorize, userRouter);
app.use('/notes', authorize, noteRouter);

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
                health: 'GET /health'
            }
        }
    })
});



app.use(errorMiddleware);

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    await connectToDatabase();
    startReminderService();
});

export default app;