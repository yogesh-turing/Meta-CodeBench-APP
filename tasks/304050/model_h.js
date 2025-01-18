// Base class for notification delivery methods
class NotificationDeliveryMethod {
    async send(notification) {
        throw new Error('Method must be implemented by subclass');
    }
}

// Concrete implementation for email delivery using SMTP
class EmailDeliveryMethod extends NotificationDeliveryMethod {
    constructor(smtpConfig) {
        super();
        this.smtpConfig = smtpConfig;
    }

    async send(notification) {
        const transporter = nodemailer.createTransport(this.smtpConfig);
        await transporter.sendMail({
            from: notification.from,
            to: notification.to,
            subject: notification.subject,
            text: notification.body
        });
    }
}

// Base class for notification types
class NotificationType {
    constructor(userData, messageContent) {
        this.userData = userData;
        this.messageContent = messageContent;
    }

    async send(deliveryMethod) {
        throw new Error('Method must be implemented by subclass');
    }
}

// Concrete implementation for welcome notifications
class WelcomeNotification extends NotificationType {
    constructor(userData, messageContent) {
        super(userData, messageContent);
        this.subject = 'Welcome to Our Platform';
        this.body = `Hello ${userData.name},\n\nWelcome to our platform! ${messageContent}`;
        this.from = 'welcome@company.com';
        this.to = userData.email;
    }

    async send(deliveryMethod) {
        await deliveryMethod.send({
            from: this.from,
            to: this.to,
            subject: this.subject,
            body: this.body
        });
        console.log(`Sent welcome email to ${this.to}`);
    }
}

// Concrete implementation for password reset notifications
class PasswordResetNotification extends NotificationType {
    constructor(userData, messageContent, tokenService) {
        super(userData, messageContent);
        this.subject = 'Password Reset Request';
        this.body = `Hello ${userData.name},\n\nYou requested a password reset. ${messageContent}\nToken: ${tokenService.generateToken()}`;
        this.from = 'security@company.com';
        this.to = userData.email;
        this.tokenService = tokenService;
    }

    async send(deliveryMethod) {
        await deliveryMethod.send({
            from: this.from,
            to: this.to,
            subject: this.subject,
            body: this.body
        });
        await this.tokenService.storeToken(this.userData.id, this.tokenService.generateToken());
        console.log(`Sent password reset email to ${this.to}`);
    }
}

// Concrete implementation for account locked notifications
class AccountLockedNotification extends NotificationType {
    constructor(userData, messageContent) {
        super(userData, messageContent);
        this.subject = 'Account Security Alert';
        this.body = `Hello ${userData.name},\n\nYour account has been locked. ${messageContent}`;
        this.from = 'security@company.com';
        this.to = userData.email;
    }

    async send(deliveryMethod) {
        await deliveryMethod.send({
            from: this.from,
            to: this.to,
            subject: this.subject,
            body: this.body
        });
        console.log(`Sent account locked email to ${this.to}`);
    }
}

// Token service for managing password reset tokens
class TokenService {
    generateToken() {
        // Implement token generation logic
    }

    async storeToken(userId, token) {
        // Implement token storage logic
    }
}

// Factory for instantiating notifications with proper configuration
class NotificationFactory {
    constructor(smtpConfig, tokenService) {
        this.smtpConfig = smtpConfig;
        this.tokenService = tokenService;
    }

    createNotification(notificationType, userData, messageContent) {
        let notification;
        switch (notificationType) {
            case 'welcome_email':
                notification = new WelcomeNotification(userData, messageContent);
                break;
            case 'password_reset':
                notification = new PasswordResetNotification(userData, messageContent, this.tokenService);
                break;
            case 'account_locked':
                notification = new AccountLockedNotification(userData, messageContent);
                break;
            default:
                throw new Error(`Unknown notification type: ${notificationType}`);
        }
        return notification;
    }

    createDeliveryMethod() {
        return new EmailDeliveryMethod(this.smtpConfig);
    }
}

// Usage example
const smtpConfig = {
    host: 'smtp.company.com',
    port: 587,
    secure: false,
    auth: {
        user: 'username',
        pass: 'password'
    }
};

const tokenService = new TokenService();
const notificationFactory = new NotificationFactory(smtpConfig, tokenService);

async function sendNotification(notificationType, userData, messageContent) {
    const notification = notificationFactory.createNotification(notificationType, userData, messageContent);
    const deliveryMethod = notificationFactory.createDeliveryMethod();
    await notification.send(deliveryMethod);
}

// Test the refactored system
sendNotification('welcome_email', { name: 'John Doe', email: 'john.doe@example.com' }, 'Thank you for joining our platform!');
sendNotification('password_reset', { name: 'Jane Doe', email: 'jane.doe@example.com' }, 'Please reset your password using the provided token.');
sendNotification('account_locked', { name: 'John Doe', email: 'john.doe@example.com' }, 'Your account has been locked due to security reasons.');


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