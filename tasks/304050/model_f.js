// Base class for notification delivery methods
class NotificationDeliveryMethod {
    async send(notification) {
        throw new Error('Method must be implemented by subclass');
    }
}

// Implementation of NotificationDeliveryMethod for email delivery via SMTP
class EmailDeliveryMethod extends NotificationDeliveryMethod {
    constructor(smtpConfig) {
        super();
        this.smtpConfig = smtpConfig;
        this.transporter = this.createTransporter();
    }

    createTransporter() {
        // Create nodemailer transporter instance
        return nodemailer.createTransport({
            host: this.smtpConfig.server,
            port: this.smtpConfig.port,
            secure: this.smtpConfig.secure,
            auth: {
                user: this.smtpConfig.username,
                pass: this.smtpConfig.password
            }
        });
    }

    async send(notification) {
        // Use the transporter to send the email
        await this.transporter.sendMail({
            from: notification.from,
            to: notification.to,
            subject: notification.subject,
            text: notification.body
        });
    }
}

// Base class for notification types
class NotificationType {
    async prepare(userData, messageContent) {
        throw new Error('Method must be implemented by subclass');
    }
}

// Welcome email notification type
class WelcomeNotification extends NotificationType {
    async prepare(userData, messageContent) {
        return {
            subject: 'Welcome to Our Platform',
            body: `Hello ${userData.name},\n\nWelcome to our platform! ${messageContent}`,
            from: 'welcome@company.com',
            to: userData.email
        };
    }
}

// Password reset notification type
class PasswordResetNotification extends NotificationType {
    constructor(tokenService) {
        super();
        this.tokenService = tokenService;
    }

    async prepare(userData, messageContent) {
        const resetToken = await this.tokenService.generateResetToken(userData.id);
        return {
            subject: 'Password Reset Request',
            body: `Hello ${userData.name},\n\nYou requested a password reset. ${messageContent}\nToken: ${resetToken}`,
            from: 'security@company.com',
            to: userData.email
        };
    }
}

// Account locked notification type
class AccountLockedNotification extends NotificationType {
    async prepare(userData, messageContent) {
        return {
            subject: 'Account Security Alert',
            body: `Hello ${userData.name},\n\nYour account has been locked. ${messageContent}`,
            from: 'security@company.com',
            to: userData.email
        };
    }
}

// Token service for managing password reset tokens
class TokenService {
    async generateResetToken(userId) {
        // Implement logic to generate and store reset token
        // For demonstration, a simple token is generated
        const token = 'reset-token-' + userId;
        // Store the token (this step is omitted for brevity)
        return token;
    }
}

// Notification factory for creating notification instances
class NotificationFactory {
    constructor(tokenService, smtpConfig) {
        this.tokenService = tokenService;
        this.smtpConfig = smtpConfig;
    }

    createNotification(notificationType, userData, messageContent) {
        let notification;
        switch (notificationType) {
            case 'welcome_email':
                notification = new WelcomeNotification();
                break;
            case 'password_reset':
                notification = new PasswordResetNotification(this.tokenService);
                break;
            case 'account_locked':
                notification = new AccountLockedNotification();
                break;
            default:
                throw new Error(`Unknown notification type: ${notificationType}`);
        }

        return notification.prepare(userData, messageContent).then(preparedNotification => {
            const deliveryMethod = new EmailDeliveryMethod(this.smtpConfig);
            return deliveryMethod.send(preparedNotification).then(() => {
                console.log(`Sent ${notificationType} to ${userData.email}`);
                return true;
            });
        });
    }
}

// Example usage
const tokenService = new TokenService();
const smtpConfig = {
    server: 'smtp.company.com',
    port: 587,
    secure: false,
    username: 'username',
    password: 'password'
};
const notificationFactory = new NotificationFactory(tokenService, smtpConfig);

// Assuming userData and messageContent are defined
const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
const messageContent = 'This is a test message.';

notificationFactory.createNotification('welcome_email', userData, messageContent).then(result => {
    console.log(result); // Should print: true
}).catch(error => {
    console.error(error);
});

module.exports = {
    NotificationDeliveryMethod,
    EmailDeliveryMethod,
    NotificationType,
    WelcomeNotification,
    PasswordResetNotification,
    AccountLockedNotification,
    TokenService,
    NotificationFactory,
    sendNotification
  };