import cron from 'node-cron';
import Note from '../models/note.model.js';
import User from '../models/user.model.js';
import { sendReminderEmail, sendNoteUnlockedEmail } from './email.service.js';

export const startReminderService = () => {
    // check every minute from reminders
    cron.schedule('* * * * *', async () => {
        console.log('Checking for reminders...');
        const now = new Date();
        try {
            // find notes w/ reminders that are already due
            const notesToRemind = await Note.find({ 
                status: 'pending', 
                reminderAt: { 
                    $type: 'date',
                    $lte: now
                }})
                .populate('userId');

                for(const note of notesToRemind) {
                    const user = await User.findById(note.userId);
                    if (user) {
                        await sendReminderEmail(user.email, user.name, note);
                        note.reminderAt = null;
                        await note.save();
                    }
                }
        }
        catch(e) {
            console.error('Error in reminder service!', e);
        }
    });

    // check every minute for notes to be unlocked
    cron.schedule('* * * * *', async () => {
        console.log('Checking for notes to unlock...');
        const now = new Date();

        try { 
            const notesToUnlock = await Note.find({
                status: 'pending',
                openAt: { $lte: now },
                unlockEmailSent: false
            });

            for(const note of notesToUnlock) {
                const user = await User.findById(note.userId);
                if(user) {
                    await sendNoteUnlockedEmail(user.email, user.name, note);
                    // Mark email as sent
                    note.unlockEmailSent = true;
                    await note.save();
                }
            }
        }
        catch(e) {
            console.error('Error in unlocking notes service, ', e);
        }
    })
}