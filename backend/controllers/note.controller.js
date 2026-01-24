import Note from '../models/note.model.js';

export const getNotes = async(req, res, next) => {
    try {
        const notes = await Note
            .find({ userId: req.user._id, status: { $ne: 'deleted' }})
            .sort({ openAt: 1 });

        // seperate notes by states
        const now = new Date();
        const locked = notes.filter(note => note.status === 'pending' && note.openAt > now);
        const unlocked = notes.filter(note => note.status === 'pending' && note.openAt <= now);
        const opened = notes.filter(note => note.status === 'opened');

        res.status(200).json({
            success: true,
            count: notes.length,
            data: {
                locked,
                unlocked,
                opened,
                all: notes
            }
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
            userId: req.user._id
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

export const getNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if(!note) {
            const error = new Error('Note not found.');
            error.statusCode = 404;
            throw error;
        }

        // check if the note belongs to the user
        if(req.user._id.toString() !== note.userId.toString()) {
            const error = new Error('Unauthorized to view this note.');
            error.statusCode = 403;
            throw error;
        }

        // check if note can be opened
        if(note.openAt && note.openAt > new Date()) {
            const error = new Error('Note not yet unlocked!');
            error.statusCode = 403;
            throw error;
        }


        // check if note is deleted
        if(note.status === 'deleted') {
            const error = new Error('Note not found.');
            error.statusCode = 404;
            throw error;
        }

        // mark as opened if it's the first time
        if(note.status === 'pending') {
            note.status = 'opened';
            note.openedAt = new Date();
            await note.save();
        }

        res.status(200).json({
            success: true,
            data: note
        });
    }
    catch(e) {
        next(e);
    }
}

export const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);

        if(!note) {
            const error = new Error('Note not found.');
            error.statusCode = 404;
            throw error;
        }

        // check if the note belongs to the user
        if(req.user._id.toString() !== note.userId.toString()) {
            const error = new Error('Unauthorized to delete this note.');
            error.statusCode = 403;
            throw error;
        }

        // check if note is already deleted
        if(note.status === 'deleted') {
            const error = new Error('Note already deleted!');
            error.statusCode = 410;
            throw error;
        }

        note.status = 'deleted';
        await note.save();

        res.status(204).json({
            success: true,
            message: 'Note deleted successfully.'
        });
    }
    catch(e) {
        next(e);
    }
}