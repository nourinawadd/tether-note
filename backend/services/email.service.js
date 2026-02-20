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
        html: `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f2;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" 
                style="background:#ffffff; padding:50px; border-radius:16px; 
                font-family:'Playfair Display', Georgia, serif; color:#2f3e2f;">
                
                <tr>
                    <td style="text-align:center;">
                    <h1 style="font-weight:500; font-size:28px; margin-bottom:20px; color:#3a5a40;">
                        A gentle reminder 🌿
                    </h1>
                    </td>
                </tr>

                <tr>
                    <td style="font-size:17px; line-height:1.8;">
                    <p>Hello ${userName},</p>

                    <p>
                        Your note titled <strong>"${note.title}"</strong> 
                        will quietly unlock on:
                    </p>

                    <p style="font-size:18px; margin:20px 0; color:#588157;">
                        <strong>${note.openAt.toLocaleString()}</strong>
                    </p>

                    <p style="font-style:italic; color:#6b705c;">
                        "${note.content.substring(0, 60)}..."
                    </p>

                    <br>

                    <p style="margin-top:40px;">
                        With warmth,<br>
                        <span style="color:#3a5a40;">Tether Note</span>
                    </p>
                    </td>
                </tr>

                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>
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
        html:`
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f2;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" 
                style="background:#ffffff; padding:50px; border-radius:16px; 
                font-family:'Playfair Display', Georgia, serif; color:#2f3e2f;">
                
                <tr>
                    <td style="text-align:center;">
                    <h1 style="font-weight:500; font-size:28px; margin-bottom:20px; color:#3a5a40;">
                        Your note has blossomed 🌿
                    </h1>
                    </td>
                </tr>

                <tr>
                    <td style="font-size:17px; line-height:1.8;">
                    <p>Hello ${userName},</p>

                    <p>
                        Your note <strong>"${note.title}"</strong> is now open and ready to be read.
                    </p>

                    <div style="text-align:center; margin:35px 0;">
                        <a href="${process.env.FRONTEND_URL}/notes/${note._id}" 
                        style="text-decoration:none; background:#588157; color:#ffffff; 
                        padding:14px 28px; border-radius:30px; font-size:16px;">
                        Read Your Note
                        </a>
                    </div>

                    <p style="margin-top:40px;">
                        With warmth,<br>
                        <span style="color:#3a5a40;">Tether Note</span>
                    </p>
                    </td>
                </tr>

                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>
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