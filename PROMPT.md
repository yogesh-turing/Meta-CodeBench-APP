Base Code:
```javascript
const nodemailer = require('nodemailer');

async function sendNotification(notificationType, userData, messageContent) {
    /**
     * Handles sending different types of notifications to users
     */
    
    if (notificationType === 'welcome_email') {
        const subject = 'Welcome to Our Platform';
        const body = `Hello ${userData.name},\n\nWelcome to our platform! ${messageContent}`;
        
        // Send email using SMTP
        const server = 'smtp.company.com';
        const port = 587;
        const sender = 'welcome@company.com';
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: server,
            port: port,
            secure: false,
            auth: {
                user: 'username',
                pass: 'password'
            }
        });
        
        // Send email
        await transporter.sendMail({
            from: sender,
            to: userData.email,
            subject: subject,
            text: body
        });
        
        // Log the notification
        console.log(`Sent welcome email to ${userData.email}`);
        return true;
        
    } else if (notificationType === 'password_reset') {
        const subject = 'Password Reset Request';
        const resetToken = generateResetToken(); // Assume this function exists
        const body = `Hello ${userData.name},\n\nYou requested a password reset. ${messageContent}\nToken: ${resetToken}`;
        
        // Send email using SMTP
        const server = 'smtp.company.com';
        const port = 587;
        const sender = 'security@company.com';
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: server,
            port: port,
            secure: false,
            auth: {
                user: 'username',
                pass: 'password'
            }
        });
        
        // Send email
        await transporter.sendMail({
            from: sender,
            to: userData.email,
            subject: subject,
            text: body
        });
        
        // Store token in database
        await storeResetToken(userData.id, resetToken); // Assume this function exists
        
        // Log the notification
        console.log(`Sent password reset email to ${userData.email}`);
        return true;
        
    } else if (notificationType === 'account_locked') {
        const subject = 'Account Security Alert';
        const body = `Hello ${userData.name},\n\nYour account has been locked. ${messageContent}`;
        
        // Send email using SMTP
        const server = 'smtp.company.com';
        const port = 587;
        const sender = 'security@company.com';
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: server,
            port: port,
            secure: false,
            auth: {
                user: 'username',
                pass: 'password'
            }
        });
        
        // Send email
        await transporter.sendMail({
            from: sender,
            to: userData.email,
            subject: subject,
            text: body
        });
        
        // Log the notification
        console.log(`Sent account locked email to ${userData.email}`);
        return true;
        
    } else {
        console.log(`Unknown notification type: ${notificationType}`);
        return false;
    }
}
```
Prompt:
Refactor this notification system using object-oriented design principles and the Factory pattern. Create the following key classes: a NotificationDeliveryMethod base class with an EmailDeliveryMethod implementation for handling SMTP delivery, a NotificationType base class with concrete implementations for welcome, password reset, and account locked notifications, a TokenService for managing password reset tokens, and a NotificationFactory for instantiating notifications with proper configuration. 
Each class should have clear responsibilities and interfaces to facilitate unit testing - delivery methods should be mockable for testing notifications, the token service should be injectable for testing password resets, and the factory should allow testing notification creation logic in isolation. The refactored system should maintain existing functionality while enabling easy testing of each component.