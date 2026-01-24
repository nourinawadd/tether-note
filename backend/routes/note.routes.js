import { Router } from 'express';
import { createNote, deleteNote, getNote, getNotes } from '../controllers/note.controller.js';
import Note from '../models/note.model.js';

const noteRouter = Router();

noteRouter.get('/', getNotes);
noteRouter.post('/', createNote);
noteRouter.get('/:id', getNote);
noteRouter.delete('/:id', deleteNote);
noteRouter.post('/quick-test', async (req, res) => {
    try {
        const now = new Date();
        
        // Array of different test note variations
        const noteVariations = [
            { title: "Future Me Reminder", content: "Hey future me! Don't forget about this important thing you were working on." },
            { title: "Time Capsule Message", content: "I wonder what life will be like when you read this? Remember to stay positive!" },
            { title: "Secret Recipe", content: "That amazing pasta sauce recipe you discovered: garlic, tomatoes, basil, and a pinch of love." },
            { title: "Motivational Note", content: "You're doing great! Keep pushing forward and don't give up on your dreams." },
            { title: "Birthday Surprise", content: "Happy future birthday! Hope this year brings you joy and success!" },
            { title: "Workout Goals", content: "Remember that fitness goal you set? Time to check in and see how far you've come!" },
            { title: "Book Recommendation", content: "That book you wanted to read later - don't forget to pick it up when you see this!" },
            { title: "Project Milestone", content: "Checking in on that project you started. How's it going? Time for an update!" }
        ];
        
        // Pick a random note
        const randomNote = noteVariations[Math.floor(Math.random() * noteVariations.length)];
        
        const note = await Note.create({
            title: req.body?.title || randomNote.title,
            content: req.body?.content || randomNote.content,
            openAt: new Date(now.getTime() + 2 * 60 * 1000), // 2 min from NOW
            reminderAt: new Date(now.getTime() + 1 * 60 * 1000), // 1 min from NOW
            userId: req.user._id
        });
        
        res.json({ 
            success: true, 
            data: note,
            info: {
                createdAt: now.toLocaleTimeString(),
                reminderAt: note.reminderAt.toLocaleTimeString(),
                openAt: note.openAt.toLocaleTimeString(),
                willRemindIn: '1 minute',
                willUnlockIn: '2 minutes'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default noteRouter;