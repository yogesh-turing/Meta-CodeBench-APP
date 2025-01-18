const nodemailer = require('nodemailer');

class NotificationDeliveryMethod {
    async deliver(notification) {
        throw new Error('Must be implemented by subclass');
    }
}

class EmailDeliveryMethod extends NotificationDeliveryMethod {
    constructor(smtpConfig) {
        super();
        this.smtpConfig = smtpConfig;
    }

    async deliver(notification) {
        const transporter = nodemailer.createTransport(this.smtpConfig);
        await transporter.sendMail({
            from: notification.from,
            to: notification.to,
            subject: notification.subject,
            text: notification.body
        });
    }
}

class NotificationType {
    async prepareNotification(userData, messageContent) {
        throw new Error('Must be implemented by subclass');
    }

    async sendNotification(notificationDeliveryMethod, userData, messageContent) {
        const notification = await this.prepareNotification(userData, messageContent);
        await notificationDeliveryMethod.deliver(notification);
    }
}

class WelcomeNotification extends NotificationType {
    async prepareNotification(userData, messageContent) {
        return {
            from: 'welcome@company.com',
            to: userData.email,
            subject: 'Welcome to Our Platform',
            body: `Hello ${userData.name},\n\nWelcome to our platform! ${messageContent}`
        };
    }
}

class PasswordResetNotification extends NotificationType {
    constructor(tokenService) {
        super();
        this.tokenService = tokenService;
    }

    async prepareNotification(userData, messageContent) {
        const resetToken = await this.tokenService.generateResetToken();
        await this.tokenService.storeResetToken(userData.id, resetToken);
        return {
            from: 'security@company.com',
            to: userData.email,
            subject: 'Password Reset Request',
            body: `Hello ${userData.name},\n\nYou requested a password reset. ${messageContent}\nToken: ${resetToken}`
        };
    }
}

class AccountLockedNotification extends NotificationType {
    async prepareNotification(userData, messageContent) {
        return {
            from: 'security@company.com',
            to: userData.email,
            subject: 'Account Security Alert',
            body: `Hello ${userData.name},\n\nYour account has been locked. ${messageContent}`
        };
    }
}

class TokenService {
    async generateResetToken() {
        // Implement token generation logic here
    }

    async storeResetToken(userId, resetToken) {
        // Implement token storage logic here
    }
}

class NotificationFactory {
    constructor(tokenService, smtpConfig) {
        this.tokenService = tokenService;
        this.smtpConfig = smtpConfig;
    }

    createNotification(notificationType) {
        switch (notificationType) {
            case 'welcome_email':
                return new WelcomeNotification();
            case 'password_reset':
                return new PasswordResetNotification(this.tokenService);
            case 'account_locked':
                return new AccountLockedNotification();
            default:
                throw new Error(`Unknown notification type: ${notificationType}`);
        }
    }

    createDeliveryMethod() {
        return new EmailDeliveryMethod(this.smtpConfig);
    }
}

async function sendNotification(notificationType, userData, messageContent) {
    const notificationFactory = new NotificationFactory(new TokenService(), {
        host: 'smtp.company.com',
        port: 587,
        secure: false,
        auth: {
            user: 'username',
            pass: 'password'
        }
    });

    const notification = notificationFactory.createNotification(notificationType);
    const deliveryMethod = notificationFactory.createDeliveryMethod();

    await notification.sendNotification(deliveryMethod, userData, messageContent);
    console.log(`Sent ${notificationType} email to ${userData.email}`);
}

// Example usage
sendNotification('welcome_email', { name: 'John Doe', email: 'john.doe@example.com' }, 'Thank you for joining us!');

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