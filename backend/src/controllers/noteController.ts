import { Request, Response } from 'express';
import Note from '../models/Note';

export const createNote = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { content, releaseDate } = req.body;

    try {
        const note = await Note.create({ userId, content, releaseDate });
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create note' });
    }
};

export const getAvailableNotes = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
        const notes = await Note.find({ userId, releaseDate: { $lte: new Date() } });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get notes' });
    }
};

export const getFutureNotes = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
        const notes = await Note.find({ userId, releaseDate: { $gt: new Date() } });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get notes' });
    }
};
