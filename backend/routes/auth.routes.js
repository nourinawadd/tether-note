import { Router } from 'express';
import { signUp, signIn } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);

authRouter.post('/sign-out', (req, res) => {
    res.send({title: 'sign out'});
});

export default authRouter;