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

module.exports = {
  sendNotification,
};