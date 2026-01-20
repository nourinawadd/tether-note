import { Router } from 'express';

const noteRouter = Router();

noteRouter.get('/', (req, res) => {
    res.send({title: 'GET user notes'});
});

noteRouter.get('/:id', (req, res) => {
    res.send({title: 'GET note'});
});

noteRouter.post('/', (req, res) => {
    res.send({title: 'POST new note'});
});

noteRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE note'});
});

export default noteRouter;