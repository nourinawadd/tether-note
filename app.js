import 'dotenv/config';
import express from 'express';
import userRouter from './backend/routes/user.routes.js';
import noteRouter from './backend/routes/note.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/notes', noteRouter);
app.get('/', (req, res) => {
    res.send('WELCOME');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;