import { Router } from 'express';
import { getUser, updateUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUser);
userRouter.put('/', updateUser);

export default userRouter;
