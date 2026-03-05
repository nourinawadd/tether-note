import cron from 'node-cron';
import Note from '../models/note.model.js';
import User from '../models/user.model.js';
import { sendReminderEmail, sendNoteUnlockedEmail } from './email.service.js';

const JOB_LOCK = {
    running: false
};

export const processReminderEmails = async (now = new Date()) => {
    // find notes with reminders that are already due
    const notesToRemind = await Note.find({
        status: 'pending',
        reminderAt: {
            $type: 'date',
            $lte: now
        }
    }).populate('userId');

    let sentCount = 0;

    for (const note of notesToRemind) {
        const user = await User.findById(note.userId);
        if (user) {
            await sendReminderEmail(user.email, user.name, note);
            note.reminderAt = null;
            await note.save();
            sentCount += 1;
        }
    }

    return sentCount;
};

export const processUnlockEmails = async (now = new Date()) => {
    const notesToUnlock = await Note.find({
        status: 'pending',
        openAt: { $lte: now },
        unlockEmailSent: false
    });
    let sentCount = 0;

    for (const note of notesToUnlock) {
        const user = await User.findById(note.userId);
        if (user) {
            await sendNoteUnlockedEmail(user.email, user.name, note);
            note.unlockEmailSent = true;
            await note.save();
            sentCount += 1;
        }
    }

    return sentCount;
};

export const processEmailJobs = async () => {
    if (JOB_LOCK.running) {
        return { skipped: true, reason: 'job already running' };
    }

    JOB_LOCK.running = true;

    try {
        const now = new Date();
        const reminderEmailsSent = await processReminderEmails(now);
        const unlockEmailsSent = await processUnlockEmails(now);

        return {
            skipped: false,
            reminderEmailsSent,
            unlockEmailsSent,
            ranAt: now.toISOString()
        };
    } finally {
        JOB_LOCK.running = false;
    }
};

export const startReminderService = () => {
    // check every minute for reminders and unlock notifications
    cron.schedule('* * * * *', async () => {
        console.log('Checking for reminders and unlock emails...');

        try {
            const result = await processEmailJobs();
            if (!result.skipped) {
                console.log('Email jobs completed', result);
            }
        } catch (e) {
            console.error('Error in scheduled email jobs!', e);
        }
    });
};