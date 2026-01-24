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

app.get('/', (req, res) => {
    res.send('WELCOME');
})

app.use(errorMiddleware);

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    await connectToDatabase();
    startReminderService();
});

export default app;