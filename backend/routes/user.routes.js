import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.send({title: 'GET user profile'});
});

export default userRouter;