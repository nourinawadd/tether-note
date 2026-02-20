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
</head>
<body style="margin:0;padding:0;background:#eef1ed;font-family:'Merriweather', Georgia, serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" 
          style="background:#ffffff;border-radius:16px;overflow:hidden;
          box-shadow:0 10px 30px rgba(0,0,0,0.06);">

          <!-- Header Strip -->
          <tr>
            <td style="background:linear-gradient(90deg,#4b5d3a,#61734d);padding:24px;text-align:center;">
              <img src="https://yourdomain.com/logo.png" 
                   alt="Tether Note Logo" 
                   width="120" 
                   style="display:block;margin:0 auto;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin:0 0 20px 0;font-size:26px;color:#111827;font-family:'Playfair Display', Georgia, serif;">
                Reminder
              </h2>

              <p style="font-size:16px;color:#4b5563;line-height:1.7;margin-bottom:16px;">
                Hi ${userName},
              </p>

              <p style="font-size:16px;color:#4b5563;line-height:1.7;margin-bottom:16px;">
                Just a quick reminder about your note 
                <strong>"${note.title}"</strong>.
              </p>

              <p style="font-size:16px;color:#4b5563;line-height:1.7;margin-bottom:16px;">
                It’s scheduled to unlock on:
              </p>

              <p style="font-size:16px;color:#111827;font-weight:600;margin:12px 0 24px 0;">
                ${note.openAt.toLocaleString()}
              </p>

              <p style="font-size:15px;color:#6b7280;line-height:1.7;">
                Preview: ${note.content.substring(0, 120)}...
              </p>

              <div style="text-align:center;margin:30px 0;">
                <a href="${process.env.FRONTEND_URL}/notes/${note._id}"
                   style="background:linear-gradient(135deg,#4b5d3a,#61734d);
                   color:#ffffff;padding:16px 32px;border-radius:12px;
                   text-decoration:none;font-size:16px;font-weight:600;
                   display:inline-block;transition:all 0.3s ease;">
                   View Note
                </a>
              </div>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">

              <p style="font-size:13px;color:#9ca3af;text-align:center;">
                Tether Note
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
html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#eef1ed;font-family:'Merriweather', Georgia, serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" 
          style="background:#ffffff;border-radius:16px;overflow:hidden;
          box-shadow:0 10px 30px rgba(0,0,0,0.06);">

          <!-- Header Strip -->
          <tr>
            <td style="background:linear-gradient(90deg,#4b5d3a,#61734d);padding:24px;text-align:center;">
              <img src="https://yourdomain.com/logo.png" 
                   alt="Tether Note Logo" 
                   width="120" 
                   style="display:block;margin:0 auto;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin:0 0 20px 0;font-size:26px;color:#111827;font-family:'Playfair Display', Georgia, serif;">
                Your Note Is Unlocked
              </h2>

              <p style="font-size:16px;color:#4b5563;line-height:1.7;margin-bottom:16px;">
                Hi ${userName},
              </p>

              <p style="font-size:16px;color:#4b5563;line-height:1.7;margin-bottom:32px;">
                The note you scheduled, 
                <strong>"${note.title}"</strong>, is now available.
              </p>

              <div style="text-align:center;margin:30px 0;">
                <a href="${process.env.FRONTEND_URL}/notes/${note._id}"
                   style="background:linear-gradient(135deg,#4b5d3a,#61734d);
                   color:#ffffff;padding:16px 32px;border-radius:12px;
                   text-decoration:none;font-size:16px;font-weight:600;
                   display:inline-block;transition:all 0.3s ease;">
                   Open Note
                </a>
              </div>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">

              <p style="font-size:13px;color:#9ca3af;text-align:center;">
                Tether Note
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