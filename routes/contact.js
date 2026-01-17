// routes/contact.js
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, msg: "All fields required" });
  }

  try {
    // setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can also use SMTP config
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // send mail
    await transporter.sendMail({
      from: `"${name}" <${email}>`, // sender info
      to: process.env.EMAIL_USER, // your receiving email
      subject: `New message from ${name}`,
      text: message,
      html: `
        <h3>New Contact Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({ success: true, msg: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Failed to send message" });
  }
});

module.exports = router;
