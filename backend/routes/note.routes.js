import { Router } from 'express';
import { createNote, getNotes } from '../controllers/note.controller.js';

const noteRouter = Router();

noteRouter.get('/', getNotes);
noteRouter.post('/', createNote);

noteRouter.get('/:id', (req, res) => {
    res.send({title: 'GET note'});
});

noteRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE note'});
});

export default noteRouter;