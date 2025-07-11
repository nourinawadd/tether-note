import express from 'express';
import { createNote, getAvailableNotes, getFutureNotes } from '../controllers/noteController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/', createNote);
router.get('/', getAvailableNotes);
router.get('/future', getFutureNotes);

export default router;
