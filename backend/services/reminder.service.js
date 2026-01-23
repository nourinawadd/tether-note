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
    })
}