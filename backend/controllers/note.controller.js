import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Note from '../models/note.model.js';

export const getNotes = async(req, res, next) => {
    try {
        const notes = await Note
            .find({ user: req.user._id })
            .sort({ openAt: 1 });

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });
    }
    catch(e) {
        next(e);
    }
}

export const createNote = async(req, res, next) => {
    try {
        const note = await Note.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            data: note
        });
    }
    catch(e) {
        next(e);
    }
}