# Email Integration Setup for Password Recovery

## Current Implementation

The "Forgot Password" feature is currently implemented in **development mode**:
- ✅ User enters email address
- ✅ System finds the user account
- ✅ Shows success message
- ✅ Displays password in an alert (for testing only)
- ❌ Does NOT actually send emails yet

## How to Enable Real Email Sending

### Option 1: EmailJS (Recommended for Prototyping)

**Pros:** Easy to set up, no backend needed, free tier available
**Cons:** API key exposed in client-side code (not suitable for production)

#### Setup Steps:

1. **Sign up at [EmailJS](https://www.emailjs.com/)**

2. **Create an Email Service:**
   - Connect your Gmail, Outlook, or other email provider
   - Get your Service ID

3. **Create an Email Template:**
   - Template variables:
     - `{{to_email}}` - recipient email
     - `{{to_name}}` - recipient name
     - `{{password}}` - user's password
     - `{{app_name}}` - Bus2College
   - Example template:
     ```
     Hello {{to_name}},
     
     You requested your password for {{app_name}}.
     
     Your password is: {{password}}
     
     For security reasons, we recommend changing your password after logging in.
     
     If you didn't request this, please contact support.
     
     Best regards,
     Bus2College Team
     ```

4. **Get your Template ID and User ID**

5. **Update the code:**
   - Add EmailJS script to `index.html` before closing `</body>` tag:
     ```html
     <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
     <script>
         (function(){
             emailjs.init("YOUR_USER_ID"); // Replace with your User ID
         })();
     </script>
     ```

6. **Update `sendPasswordEmail` function in `js/auth.js`:**
   ```javascript
   function sendPasswordEmail(email, password, name) {
       emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
           to_email: email,
           to_name: name,
           password: password,
           app_name: 'Bus2College'
       })
       .then(function(response) {
           closeForgotPasswordModal();
           showMessage(`Password has been sent to ${email}. Please check your inbox.`, 'success');
       }, function(error) {
           showMessage('Failed to send email. Please try again later.', 'error');
           console.error('Email send error:', error);
       });
   }
   ```

### Option 2: Backend Email Service (Recommended for Production)

**Pros:** Secure, full control, API keys protected
**Cons:** Requires backend server

#### Backend Options:

1. **Node.js + Nodemailer**
2. **Python + Flask/FastAPI + smtplib or SendGrid**
3. **PHP mail() function**

#### Example Backend Endpoint (Node.js/Express):

```javascript
// backend/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

app.post('/api/forgot-password', async (req, res) => {
    const { email, password, name } = req.body;
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    const mailOptions = {
        from: 'Bus2College <noreply@bus2college.com>',
        to: email,
        subject: 'Password Recovery - Bus2College',
        html: `
            <h2>Password Recovery</h2>
            <p>Hello ${name},</p>
            <p>You requested your password for Bus2College.</p>
            <p><strong>Your password is: ${password}</strong></p>
            <p>For security reasons, we recommend changing your password after logging in.</p>
            <p>If you didn't request this, please contact support.</p>
            <br>
            <p>Best regards,<br>Bus2College Team</p>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

#### Frontend Update:

```javascript
function sendPasswordEmail(email, password, name) {
    fetch('http://your-backend.com/api/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeForgotPasswordModal();
            showMessage(`Password has been sent to ${email}. Please check your inbox.`, 'success');
        } else {
            showMessage('Failed to send email. Please try again later.', 'error');
        }
    })
    .catch(error => {
        showMessage('Failed to send email. Please try again later.', 'error');
        console.error('Error:', error);
    });
}
```

### Option 3: Third-Party Email APIs

#### SendGrid

```javascript
// Backend
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: email,
    from: 'noreply@bus2college.com',
    subject: 'Password Recovery - Bus2College',
    text: `Your password is: ${password}`,
    html: `<p>Your password is: <strong>${password}</strong></p>`
};

sgMail.send(msg);
```

#### Mailgun

```javascript
const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const data = {
    from: 'Bus2College <noreply@bus2college.com>',
    to: email,
    subject: 'Password Recovery',
    html: `<p>Your password is: <strong>${password}</strong></p>`
};

mailgun.messages().send(data);
```

## Security Recommendations

### For Production:

1. **Never send passwords via email** - Instead:
   - Send a password reset link with a temporary token
   - Link expires after 1 hour
   - User creates a new password

2. **Hash passwords** - Never store plain text passwords:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

3. **Use HTTPS** - Always encrypt data in transit

4. **Rate limiting** - Prevent abuse:
   - Limit password reset requests per email (e.g., max 3 per hour)
   - Add CAPTCHA for forgot password form

5. **Two-factor authentication** - Add extra security layer

### Better Implementation (Password Reset Token):

```javascript
// Generate reset token
const crypto = require('crypto');
const resetToken = crypto.randomBytes(32).toString('hex');
const resetTokenExpiry = Date.now() + 3600000; // 1 hour

// Save to user record
user.resetToken = resetToken;
user.resetTokenExpiry = resetTokenExpiry;

// Send email with reset link
const resetLink = `https://bus2college.com/reset-password?token=${resetToken}`;
// Email the resetLink instead of password
```

## Current Testing

For testing the current implementation:
1. Register a new user
2. Click "Forgot password?" on login page
3. Enter the registered email
4. An alert will show the password (development mode only)
5. The success message simulates email sending

## Next Steps

Choose your email integration method based on:
- **Prototyping:** Use EmailJS
- **Production:** Build a backend with proper security
- **Enterprise:** Use SendGrid/Mailgun with password reset tokens

Update the `sendPasswordEmail` function in `js/auth.js` according to your chosen method.
