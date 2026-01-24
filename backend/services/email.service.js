import 'dotenv/config.js'
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendReminderEmail = async (userEmail, userName, note) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Reminder: ${note.title} will unlock soon`,
        html:`
            <h2>Hello ${userName}!</h2>
            <p>This is a reminder that your note "<strong>${note.title}</strong>" will unlock on:</p>
            <p><strong>${note.openAt.toLocaleString()}</strong></p>
            <p>Preview: ${note.content.substring(0, 100)}...</p>
            <br>
            <p>Best regards,<br>Tether Note Inc.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${userEmail}`);
    }
    catch(e) {
        console.error('Error sending email, ', e);
    }
};

export const sendNoteUnlockedEmail = async (userEmail, userName, note) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Your note "${note.title}" is now unlocked!`,
        html: `
            <h2>Hello ${userName}!</h2>
            <p>Your note "<strong>${note.title}</strong>" is now unlocked and ready to read!</p>
            <p><a href="${process.env.FRONTEND_URL}/notes/${note._id}">Click here to read it</a></p>
            <br>
            <p>Best regards,<br>Tether Note Inc.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Unlock email sent to ${userEmail}`);
    }
    catch(e) {
        console.error('Error sending email, ', e);
    }
};