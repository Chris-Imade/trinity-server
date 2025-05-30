# Trinity Relief Initiative API

This API provides endpoints for handling contact form submissions and newsletter subscriptions for Trinity Relief Initiative for Returnees and Migrants.

## Base URL

All API endpoints are relative to the base URL:

```
https://trinity-server.onrender.com
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```
4. Configure your environment variables in `.env`:
   - Set up Gmail credentials (requires 2FA and App Password)
   - Configure admin email
   - Add your organization's logo URL

## Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Contact Form

Submit a contact form message.

**Endpoint:** `POST https://trinity-server.onrender.com/api/contact`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "message": "I would like to know more about your services..."
}
```

**Response:**

- Success (200):
  ```json
  {
    "message": "Message sent successfully"
  }
  ```
- Error (400):
  ```json
  {
    "error": "All fields are required"
  }
  ```
- Error (500):
  ```json
  {
    "error": "Failed to send message"
  }
  ```

### Newsletter Subscription

Subscribe to the newsletter.

**Endpoint:** `POST https://trinity-server.onrender.com/api/newsletter`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

- Success (200):
  ```json
  {
    "message": "Successfully subscribed to newsletter"
  }
  ```
- Error (400):
  ```json
  {
    "error": "Email is required"
  }
  ```
- Error (500):
  ```json
  {
    "error": "Failed to subscribe to newsletter"
  }
  ```

## Email Notifications

Both endpoints trigger email notifications:

1. **Contact Form:**

   - User receives a confirmation email
   - Admin receives a notification with the contact details

2. **Newsletter:**
   - User receives a welcome email
   - Admin receives a notification about the new subscription

## Environment Variables

| Variable    | Description                       | Example                          |
| ----------- | --------------------------------- | -------------------------------- |
| PORT        | Server port number                | 3000                             |
| EMAIL_USER  | Gmail address for sending emails  | your-email@gmail.com             |
| EMAIL_PASS  | Gmail app-specific password       | xxxx-xxxx-xxxx-xxxx              |
| ADMIN_EMAIL | Email for receiving notifications | admin@yourdomain.com             |
| LOGO_URL    | URL to organization logo          | https://your-domain.com/logo.png |

## Gmail Setup

To use Gmail for sending emails:

1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security
   - 2-Step Verification
   - App Passwords
   - Generate a new app password for "Mail"
3. Use the generated password as `EMAIL_PASS` in your `.env` file

## Error Handling

The API includes comprehensive error handling:

- Input validation
- Email sending error handling
- Proper HTTP status codes
- Descriptive error messages

## Security

- Environment variables for sensitive data
- Input validation
- Secure email configuration
- Error messages don't expose internal details
