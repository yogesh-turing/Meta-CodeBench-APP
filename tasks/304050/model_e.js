const nodemailer = require('nodemailer');

class NotificationDeliveryMethod {
    async send(to, subject, body) {
        throw new Error('Method not implemented');
    }
}

class EmailDeliveryMethod extends NotificationDeliveryMethod {
    constructor(smtpConfig) {
        super();
        this.transporter = nodemailer.createTransport(smtpConfig);
    }

    async send(to, subject, body) {
        await this.transporter.sendMail({
            from: this.smtpConfig.sender,
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

    async send(deliveryMethod) {
        await deliveryMethod.send(
            this.userData.email,
            this.getSubject(),
            this.getBody()
        );
        console.log(`Sent ${this.constructor.name} to ${this.userData.email}`);
    }
}

class WelcomeNotification extends NotificationType {
    getSubject() {
        return 'Welcome to Our Platform';
    }

    getBody() {
        return `Hello ${this.userData.name},\n\nWelcome to our platform! ${this.messageContent}`;
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
        const resetToken = await this.tokenService.generateResetToken(this.userData.id);
        return `Hello ${this.userData.name},\n\nYou requested a password reset. ${this.messageContent}\nToken: ${resetToken}`;
    }
}

class AccountLockedNotification extends NotificationType {
    getSubject() {
        return 'Account Security Alert';
    }

    getBody() {
        return `Hello ${this.userData.name},\n\nYour account has been locked. ${this.messageContent}`;
    }
}

class TokenService {
    async generateResetToken(userId) {
        // Implementation for generating and storing reset token
        const token = Math.random().toString(36).substr(2, 10);
        await this.storeResetToken(userId, token);
        return token;
    }

    async storeResetToken(userId, token) {
        // Implementation for storing the token in the database
        console.log(`Stored reset token for user ${userId}`);
    }
}

class NotificationFactory {
    constructor(smtpConfig, tokenService) {
        this.smtpConfig = smtpConfig;
        this.tokenService = tokenService;
    }

    createNotification(notificationType, userData, messageContent) {
        switch (notificationType) {
            case 'welcome_email':
                return new WelcomeNotification(userData, messageContent);
            case 'password_reset':
                return new PasswordResetNotification(userData, messageContent, this.tokenService);
            case 'account_locked':
                return new AccountLockedNotification(userData, messageContent);
            default:
                throw new Error(`Unknown notification type: ${notificationType}`);
        }
    }

    createDeliveryMethod() {
        return new EmailDeliveryMethod(this.smtpConfig);
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
        sender: 'notifications@company.com'
    };

    const tokenService = new TokenService();
    const factory = new NotificationFactory(smtpConfig, tokenService);

    try {
        const notification = factory.createNotification(notificationType, userData, messageContent);
        const deliveryMethod = factory.createDeliveryMethod();
        await notification.send(deliveryMethod);
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