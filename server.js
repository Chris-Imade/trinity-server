require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const contactUserTemplate = (firstName, lastName) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting Trinity Relief Initiative</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo img { max-width: 200px; height: auto; }
        .content { color: #333333; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="${process.env.LOGO_URL}" alt="Trinity Relief Initiative Logo">
        </div>
        <div class="content">
            <h2>Thank You for Contacting Trinity Relief Initiative!</h2>
            <p>Dear ${firstName} ${lastName},</p>
            <p>We have received your message and will get back to you as soon as possible. At Trinity Relief Initiative for Returnees and Migrants, we are committed to providing support and assistance to those in need.</p>
            <p>Best regards,<br>Trinity Relief Initiative Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;

const contactAdminTemplate = (firstName, lastName, email, message) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission - Trinity Relief Initiative</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo img { max-width: 200px; height: auto; }
        .content { color: #333333; }
        .message-box { background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="${process.env.LOGO_URL}" alt="Trinity Relief Initiative Logo">
        </div>
        <div class="content">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div class="message-box">
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated message from Trinity Relief Initiative contact form.</p>
        </div>
    </div>
</body>
</html>
`;

const newsletterUserTemplate = () => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Trinity Relief Initiative Newsletter</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo img { max-width: 200px; height: auto; }
        .content { color: #333333; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="${process.env.LOGO_URL}" alt="Trinity Relief Initiative Logo">
        </div>
        <div class="content">
            <h2>Welcome to Trinity Relief Initiative Newsletter!</h2>
            <p>Thank you for subscribing to our newsletter. You'll now receive our latest updates, news, and information about our initiatives for returnees and migrants directly in your inbox.</p>
            <p>Best regards,<br>Trinity Relief Initiative Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;

const newsletterAdminTemplate = (email) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Newsletter Subscription - Trinity Relief Initiative</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo img { max-width: 200px; height: auto; }
        .content { color: #333333; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="${process.env.LOGO_URL}" alt="Trinity Relief Initiative Logo">
        </div>
        <div class="content">
            <h2>New Newsletter Subscription</h2>
            <p>A new user has subscribed to the Trinity Relief Initiative newsletter:</p>
            <p><strong>Email:</strong> ${email}</p>
        </div>
        <div class="footer">
            <p>This is an automated message from Trinity Relief Initiative newsletter subscription.</p>
        </div>
    </div>
</body>
</html>
`;

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Send email to user
    await transporter.sendMail({
      from: "Trinity Relief Initiative for Returnees and Migrants",
      to: email,
      subject: "Thank you for contacting Trinity Relief Initiative",
      html: contactUserTemplate(firstName, lastName),
    });

    // Send email to admin
    await transporter.sendMail({
      from: "Trinity Relief Initiative for Returnees and Migrants",
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission - Trinity Relief Initiative",
      html: contactAdminTemplate(firstName, lastName, email, message),
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Newsletter endpoint
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Send email to user
    await transporter.sendMail({
      from: "Trinity Relief Initiative for Returnees and Migrants",
      to: email,
      subject: "Welcome to Trinity Relief Initiative Newsletter",
      html: newsletterUserTemplate(),
    });

    // Send email to admin
    await transporter.sendMail({
      from: "Trinity Relief Initiative for Returnees and Migrants",
      to: process.env.ADMIN_EMAIL,
      subject: "New Newsletter Subscription - Trinity Relief Initiative",
      html: newsletterAdminTemplate(email),
    });

    res.status(200).json({ message: "Successfully subscribed to newsletter" });
  } catch (error) {
    console.error("Error sending newsletter email:", error);
    res.status(500).json({ error: "Failed to subscribe to newsletter" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
