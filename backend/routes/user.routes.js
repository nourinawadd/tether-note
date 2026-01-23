import { Router } from 'express';
import authorize from '../middleware/auth.middleware.js';
import { getUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUser);

export default userRouter;