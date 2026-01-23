import { Router } from 'express';
import { createNote, deleteNote, getNote, getNotes } from '../controllers/note.controller.js';

const noteRouter = Router();

noteRouter.get('/', getNotes);
noteRouter.post('/', createNote);
noteRouter.get('/:id', getNote);
noteRouter.delete('/:id', deleteNote);

export default noteRouter;