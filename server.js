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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

// Email templates
const contactUserTemplate = (firstName, lastName) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Thank you for contacting Trinity Relief Initiative</title>
    <style>
        * { box-sizing: border-box; }
        body, table, td, p, h1, h2, h3 { margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            background-color: #f8fafc;
            color: #334155;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f8fafc; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .logo img { 
            max-width: 180px; 
            height: auto; 
            margin-bottom: 15px;
            filter: brightness(0) invert(1);
        }
        .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content { 
            padding: 40px 30px;
        }
        .main-message {
            font-size: 18px;
            margin-bottom: 30px;
            color: #1e293b;
        }
        .footer { 
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center; 
            font-size: 13px; 
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0 10px; }
            .content, .footer { padding: 25px 20px; }
            .header { padding: 25px 20px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="${process.env.LOGO_URL}" alt="Trinity Relief Initiative Logo">
                </div>
                <h1>Thank You for Contacting Us!</h1>
            </div>
            <div class="content">
                <p class="main-message">Dear ${firstName} ${lastName},</p>
                <p>We have received your message and will get back to you as soon as possible. At Trinity Relief Initiative for Returnees and Migrants, we are committed to providing support and assistance to those in need.</p>
                <p>Best regards,<br>Trinity Relief Initiative Team</p>
            </div>
            <div class="footer">
                <p><strong>Trinity Relief Initiative for Returnees and Migrants</strong></p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const contactAdminTemplate = (firstName, lastName, email, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>New Contact Form Submission - Trinity Relief Initiative</title>
    <style>
        * { box-sizing: border-box; }
        body, table, td, p, h1, h2, h3 { margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            background-color: #f8fafc;
            color: #334155;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f8fafc; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .logo img { 
            max-width: 180px; 
            height: auto; 
            margin-bottom: 15px;
            filter: brightness(0) invert(1);
        }
        .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content { 
            padding: 40px 30px;
        }
        .details-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #475569;
            flex: 0 0 120px;
        }
        .detail-value {
            color: #1e293b;
            font-weight: 500;
            word-break: break-all;
            text-align: right;
            flex: 1;
        }
        .message-box {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
        }
        .footer { 
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center; 
            font-size: 13px; 
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0 10px; }
            .content, .footer { padding: 25px 20px; }
            .header { padding: 25px 20px; }
            .detail-row { flex-direction: column; align-items: flex-start; }
            .detail-label { margin-bottom: 5px; }
            .detail-value { text-align: left; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="${
                      process.env.LOGO_URL
                    }" alt="Trinity Relief Initiative Logo">
                </div>
                <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
                <div class="details-card">
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${firstName} ${lastName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${formatDate(
                          new Date().toISOString()
                        )}</span>
                    </div>
                </div>
                <div class="message-box">
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
            </div>
            <div class="footer">
                <p><strong>Trinity Relief Initiative for Returnees and Migrants</strong></p>
                <p>This is an automated message from the contact form.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const newsletterUserTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome to Trinity Relief Initiative Newsletter</title>
    <style>
        * { box-sizing: border-box; }
        body, table, td, p, h1, h2, h3 { margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            background-color: #f8fafc;
            color: #334155;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f8fafc; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .logo img { 
            max-width: 180px; 
            height: auto; 
            margin-bottom: 15px;
            filter: brightness(0) invert(1);
        }
        .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content { 
            padding: 40px 30px;
        }
        .main-message {
            font-size: 18px;
            margin-bottom: 30px;
            color: #1e293b;
        }
        .footer { 
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center; 
            font-size: 13px; 
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0 10px; }
            .content, .footer { padding: 25px 20px; }
            .header { padding: 25px 20px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="${process.env.LOGO_URL}" alt="Trinity Relief Initiative Logo">
                </div>
                <h1>Welcome to Our Newsletter!</h1>
            </div>
            <div class="content">
                <p class="main-message">Thank you for subscribing to our newsletter. You'll now receive our latest updates, news, and information about our initiatives for returnees and migrants directly in your inbox.</p>
                <p>Best regards,<br>Trinity Relief Initiative Team</p>
            </div>
            <div class="footer">
                <p><strong>Trinity Relief Initiative for Returnees and Migrants</strong></p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const newsletterAdminTemplate = (email) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>New Newsletter Subscription - Trinity Relief Initiative</title>
    <style>
        * { box-sizing: border-box; }
        body, table, td, p, h1, h2, h3 { margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            background-color: #f8fafc;
            color: #334155;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f8fafc; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .logo img { 
            max-width: 180px; 
            height: auto; 
            margin-bottom: 15px;
            filter: brightness(0) invert(1);
        }
        .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content { 
            padding: 40px 30px;
        }
        .alert-badge {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .details-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #475569;
            flex: 0 0 120px;
        }
        .detail-value {
            color: #1e293b;
            font-weight: 500;
            word-break: break-all;
            text-align: right;
            flex: 1;
        }
        .email-highlight {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        .footer { 
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center; 
            font-size: 13px; 
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0 10px; }
            .content, .footer { padding: 25px 20px; }
            .header { padding: 25px 20px; }
            .detail-row { flex-direction: column; align-items: flex-start; }
            .detail-label { margin-bottom: 5px; }
            .detail-value { text-align: left; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="${
                      process.env.LOGO_URL
                    }" alt="Trinity Relief Initiative Logo">
                </div>
                <h1>New Newsletter Subscription</h1>
            </div>
            <div class="content">
                <div class="alert-badge">🎉 New Subscriber</div>
                
                <p class="main-message">
                    Great news! A new person has joined the Trinity Relief Initiative newsletter community.
                </p>
                
                <div class="details-card">
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value email-highlight">${email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Subscribed:</span>
                        <span class="detail-value">${formatDate(
                          new Date().toISOString()
                        )}</span>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p><strong>Trinity Relief Initiative for Returnees and Migrants</strong></p>
                <p>Newsletter Administration System</p>
                <p style="margin-top: 15px;">
                    This automated notification was generated on ${formatDate(
                      new Date().toISOString()
                    )}
                </p>
            </div>
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
