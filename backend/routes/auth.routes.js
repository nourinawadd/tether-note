import { Router } from 'express';
import { signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', (req, res) => {
    res.send({title: 'sign in'});
});

authRouter.post('/sign-out', (req, res) => {
    res.send({title: 'sign out'});
});

export default authRouter;