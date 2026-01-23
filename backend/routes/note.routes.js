import { Router } from 'express';
import { getNotes } from '../controllers/note.controller';

const noteRouter = Router();

noteRouter.get('/', getNotes);

noteRouter.post('/', (req, res) => {
    res.send({title: 'POST new note'});
});

noteRouter.get('/:id', (req, res) => {
    res.send({title: 'GET note'});
});

noteRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE note'});
});

export default noteRouter;