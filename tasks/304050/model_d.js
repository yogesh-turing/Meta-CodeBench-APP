const nodemailer = require('nodemailer');

class NotificationDeliveryMethod {
    async send(to, subject, body) {
        throw new Error('Method not implemented');
    }
}

class EmailDeliveryMethod extends NotificationDeliveryMethod {
    constructor(config) {
        super();
        this.config = config;
    }

    async send(to, subject, body) {
        const transporter = nodemailer.createTransport(this.config);
        await transporter.sendMail({
            from: this.config.sender,
            to,
            subject,
            text: body
        });
    }
}

class NotificationType {
    constructor(userData, messageContent) {
        this.userData = userData;
        this.messageContent = messageContent;
    }

    async send(deliveryMethod) {
        throw new Error('Method not implemented');
    }
}

class WelcomeNotification extends NotificationType {
    async send(deliveryMethod) {
        const subject = 'Welcome to Our Platform';
        const body = `Hello ${this.userData.name},\n\nWelcome to our platform! ${this.messageContent}`;
        await deliveryMethod.send(this.userData.email, subject, body);
        console.log(`Sent welcome email to ${this.userData.email}`);
    }
}

class PasswordResetNotification extends NotificationType {
    constructor(userData, messageContent, tokenService) {
        super(userData, messageContent);
        this.tokenService = tokenService;
    }

    async send(deliveryMethod) {
        const subject = 'Password Reset Request';
        const resetToken = await this.tokenService.generateResetToken();
        const body = `Hello ${this.userData.name},\n\nYou requested a password reset. ${this.messageContent}\nToken: ${resetToken}`;
        await deliveryMethod.send(this.userData.email, subject, body);
        await this.tokenService.storeResetToken(this.userData.id, resetToken);
        console.log(`Sent password reset email to ${this.userData.email}`);
    }
}

class AccountLockedNotification extends NotificationType {
    async send(deliveryMethod) {
        const subject = 'Account Security Alert';
        const body = `Hello ${this.userData.name},\n\nYour account has been locked. ${this.messageContent}`;
        await deliveryMethod.send(this.userData.email, subject, body);
        console.log(`Sent account locked email to ${this.userData.email}`);
    }
}

class TokenService {
    async generateResetToken() {
        // Implementation of token generation
    }

    async storeResetToken(userId, token) {
        // Implementation of token storage
    }
}

class NotificationFactory {
    constructor(deliveryMethodConfig, tokenService) {
        this.deliveryMethod = new EmailDeliveryMethod(deliveryMethodConfig);
        this.tokenService = tokenService;
    }

    createNotification(type, userData, messageContent) {
        switch (type) {
            case 'welcome_email':
                return new WelcomeNotification(userData, messageContent);
            case 'password_reset':
                return new PasswordResetNotification(userData, messageContent, this.tokenService);
            case 'account_locked':
                return new AccountLockedNotification(userData, messageContent);
            default:
                throw new Error(`Unknown notification type: ${type}`);
        }
    }

    async sendNotification(type, userData, messageContent) {
        const notification = this.createNotification(type, userData, messageContent);
        await notification.send(this.deliveryMethod);
        return true;
    }
}

// Usage
const deliveryMethodConfig = {
    host: 'smtp.company.com',
    port: 587,
    secure: false,
    auth: {
        user: 'username',
        pass: 'password'
    },
    sender: 'notifications@company.com'
};

const tokenService = new TokenService();
const notificationFactory = new NotificationFactory(deliveryMethodConfig, tokenService);

async function sendNotification(notificationType, userData, messageContent) {
    try {
        return await notificationFactory.sendNotification(notificationType, userData, messageContent);
    } catch (error) {
        console.error(`Failed to send notification: ${error.message}`);
        return false;
    }
}

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