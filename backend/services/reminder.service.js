import cron from 'node-cron';
import Note from '../models/note.model.js';
import User from '../models/user.model.js';
import { sendReminderEmail, sendNoteUnlockedEmail } from './email.service.js';

export const startReminderService = () => {
    // check every hour from reminders
    cron.schedule('0 * * * *', async () => {
        console.log('Checking for reminders...');
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        try {
            // find notes w/ reminders due in the next hour
            const notesToRemind = await Note.find({ 
                status: 'pending ', 
                reminderAt: { 
                    $gte: now, 
                    $lte: oneHourFromNow 
                }})
                .populate('userId');

                for(const note in notesToRemind) {
                    const user = await User.findById(note.userId);
                    if (user) {
                        await sendReminderEmail(user.email, user.name, note);
                        note.reminderAt = null;
                        await note.save();
                        console.log(`Reminder service activated for ${user.email}`);
                    }
                }
        }
        catch(e) {
            console.error('Error in reminder service!');
        }
    });

    // check every hour for notes to be unlocked
    cron.schedule('0 * * * *', async () => {
        console.log('Checking for notes to unlock...');
        const now = new Date();

        try { 
            const notesToUnlock = await Note.find({
                status: 'pending',
                openAt: { $lte: now }
            });

            for(const note in notesToUnlock) {
                const user = await User.findById(note.userId);
                if(user) {
                    await sendNoteUnlockedEmail(user.email, user.name, note);
                    console.log(`Note unlocked + email sent to user ${user.email}`);
                }
            }
            console.log(`Unlocked and sent ${notesToUnlock.length} notes`);
        }
        catch(e) {
            console.error('Error in unlocking notes service, ', e);
        }
    })
}