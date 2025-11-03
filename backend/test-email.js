// test-email.js
const nodemailer = require('nodemailer');

(async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Test App" <test@example.com>',
      to: 'recipient@example.com',
      subject: 'Ethereal test',
      text: 'Hello from Ethereal',
      html: '<b>Hello from Ethereal</b>',
    });

    console.log('Message sent, preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('Ethereal creds:', testAccount);
  } catch (err) {
    console.error(err);
  }
})();
