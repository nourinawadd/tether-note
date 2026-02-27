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
<body style="margin:0;padding:0;background:#ffffff;font-family:'Merriweather', Georgia, serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr>
      <td align="center">

        <table width="540" cellpadding="0" cellspacing="0"
          style="background:#ffffff;">

          <!-- Logo -->
          <tr>
            <td style="padding:12px 32px 0 32px;text-align:left;">
              <img src="https://res.cloudinary.com/dhptvgccp/image/upload/fl_preserve_transparency/v1772211425/email-logo.jpg?_s=public-apps"
                   alt="Tether Note Logo"
                   width="200"
                   style="display:block;">
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="padding:14px 32px 0 32px;">
              <div style="height:2px;background:#4b5d3a;width:48px;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:20px 32px 28px 32px;">

              <h2 style="margin:0 0 18px 0;
                         font-size:22px;
                         color:#111827;
                         font-family:'Playfair Display', Georgia, serif;
                         font-weight:600;">
                Reminder: Upcoming Note
              </h2>

              <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:14px;">
                Hi ${userName},
              </p>

              <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:14px;">
                Your note titled <strong>"${note.title}"</strong> is scheduled
                to unlock on <strong>${note.openAt.toLocaleString()}</strong>.
              </p>

              <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:24px;">
                Preview:
                <br><br>
                "${note.content.substring(0, 140)}..."
              </p>

              <a href="${process.env.FRONTEND_URL}/notes/${note._id}"
                 style="background:#4b5d3a;
                 color:#ffffff;
                 padding:9px 18px;
                 border-radius:5px;
                 text-decoration:none;
                 font-size:14px;
                 font-weight:500;
                 display:inline-block;">
                 View Note
              </a>

              <div style="margin-top:32px;border-top:1px solid #e5e7eb;padding-top:14px;">
                <p style="font-size:12px;color:#9ca3af;margin:0;">
                  © Tether Note
                </p>
              </div>

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
<body style="margin:0;padding:0;background:#ffffff;font-family:'Merriweather', Georgia, serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr>
      <td align="center">

        <table width="540" cellpadding="0" cellspacing="0"
          style="background:#ffffff;">

          <!-- Logo -->
          <tr>
            <td style="padding:12px 32px 0 32px;text-align:left;">
              <img src="https://res.cloudinary.com/dhptvgccp/image/upload/fl_preserve_transparency/v1772211425/email-logo.jpg?_s=public-apps"
                   alt="Tether Note Logo"
                   width="200"
                   style="display:block;">
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="padding:14px 32px 0 32px;">
              <div style="height:2px;background:#4b5d3a;width:48px;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:20px 32px 28px 32px;">

              <h2 style="margin:0 0 18px 0;
                         font-size:22px;
                         color:#111827;
                         font-family:'Playfair Display', Georgia, serif;
                         font-weight:600;">
                Your Note Is Now Available
              </h2>

              <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:14px;">
                Hi ${userName},
              </p>

              <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:18px;">
                Your scheduled note <strong>"${note.title}"</strong> is now available.
                You can access it directly from your dashboard.
              </p>

              <a href="${process.env.FRONTEND_URL}/notes/${note._id}"
                 style="background:#4b5d3a;
                 color:#ffffff;
                 padding:9px 18px;
                 border-radius:5px;
                 text-decoration:none;
                 font-size:14px;
                 font-weight:500;
                 display:inline-block;">
                 Open Note
              </a>

              <div style="margin-top:32px;border-top:1px solid #e5e7eb;padding-top:14px;">
                <p style="font-size:12px;color:#9ca3af;margin:0;">
                  © Tether Note
                </p>
              </div>

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