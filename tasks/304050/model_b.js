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

    getSubject() {
        throw new Error('Method not implemented');
    }

    getBody() {
        throw new Error('Method not implemented');
    }

    getSender() {
        throw new Error('Method not implemented');
    }

    async additionalActions() {
        // Default implementation does nothing
    }
}

class WelcomeNotification extends NotificationType {
    getSubject() {
        return 'Welcome to Our Platform';
    }

    getBody() {
        return `Hello ${this.userData.name},\n\nWelcome to our platform! ${this.messageContent}`;
    }

    getSender() {
        return 'welcome@company.com';
    }
}

class PasswordResetNotification extends NotificationType {
    constructor(userData, messageContent, tokenService) {
        super(userData, messageContent);
        this.tokenService = tokenService;
    }

    getSubject() {
        return 'Password Reset Request';
    }

    async getBody() {
        const resetToken = await this.tokenService.generateResetToken();
        return `Hello ${this.userData.name},\n\nYou requested a password reset. ${this.messageContent}\nToken: ${resetToken}`;
    }

    getSender() {
        return 'security@company.com';
    }

    async additionalActions() {
        const resetToken = await this.tokenService.generateResetToken();
        await this.tokenService.storeResetToken(this.userData.id, resetToken);
    }
}

class AccountLockedNotification extends NotificationType {
    getSubject() {
        return 'Account Security Alert';
    }

    getBody() {
        return `Hello ${this.userData.name},\n\nYour account has been locked. ${this.messageContent}`;
    }

    getSender() {
        return 'security@company.com';
    }
}

class TokenService {
    async generateResetToken() {
        // Implementation of token generation
        return 'generated-reset-token';
    }

    async storeResetToken(userId, token) {
        // Implementation of token storage
        console.log(`Stored reset token for user ${userId}`);
    }
}

class NotificationFactory {
    constructor(deliveryMethod, tokenService) {
        this.deliveryMethod = deliveryMethod;
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

    async sendNotification(notification) {
        const subject = notification.getSubject();
        const body = await notification.getBody();
        const sender = notification.getSender();

        await this.deliveryMethod.send(notification.userData.email, subject, body);
        await notification.additionalActions();

        console.log(`Sent ${subject} email to ${notification.userData.email}`);
    }
}

async function sendNotification(notificationType, userData, messageContent) {
    const smtpConfig = {
        host: 'smtp.company.com',
        port: 587,
        secure: false,
        auth: {
            user: 'username',
            pass: 'password'
        },
        sender: 'noreply@company.com'
    };

    const deliveryMethod = new EmailDeliveryMethod(smtpConfig);
    const tokenService = new TokenService();
    const factory = new NotificationFactory(deliveryMethod, tokenService);

    try {
        const notification = factory.createNotification(notificationType, userData, messageContent);
        await factory.sendNotification(notification);
        return true;
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