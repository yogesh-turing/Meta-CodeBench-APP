// NotificationDeliveryMethod base class
class NotificationDeliveryMethod {
    async deliver(notification) {
        throw new Error('Method not implemented');
    }
}

// EmailDeliveryMethod implementation
class EmailDeliveryMethod extends NotificationDeliveryMethod {
    constructor(server, port, sender, username, password) {
        super();
        this.server = server;
        this.port = port;
        this.sender = sender;
        this.username = username;
        this.password = password;
    }

    async deliver(notification) {
        const transporter = nodemailer.createTransport({
            host: this.server,
            port: this.port,
            secure: false,
            auth: {
                user: this.username,
                pass: this.password
            }
        });

        await transporter.sendMail({
            from: this.sender,
            to: notification.userData.email,
            subject: notification.subject,
            text: notification.body
        });
    }
}

// NotificationType base class
class NotificationType {
    async send(notificationDeliveryMethod, userData, messageContent) {
        throw new Error('Method not implemented');
    }
}

// WelcomeNotification implementation
class WelcomeNotification extends NotificationType {
    async send(notificationDeliveryMethod, userData, messageContent) {
        const subject = 'Welcome to Our Platform';
        const body = `Hello ${userData.name},\n\nWelcome to our platform! ${messageContent}`;

        await notificationDeliveryMethod.deliver({
            subject,
            body,
            userData
        });

        console.log(`Sent welcome email to ${userData.email}`);
    }
}

// PasswordResetNotification implementation
class PasswordResetNotification extends NotificationType {
    constructor(tokenService) {
        super();
        this.tokenService = tokenService;
    }

    async send(notificationDeliveryMethod, userData, messageContent) {
        const subject = 'Password Reset Request';
        const resetToken = await this.tokenService.generateResetToken();
        const body = `Hello ${userData.name},\n\nYou requested a password reset. ${messageContent}\nToken: ${resetToken}`;

        await notificationDeliveryMethod.deliver({
            subject,
            body,
            userData
        });

        await this.tokenService.storeResetToken(userData.id, resetToken);
        console.log(`Sent password reset email to ${userData.email}`);
    }
}

// AccountLockedNotification implementation
class AccountLockedNotification extends NotificationType {
    async send(notificationDeliveryMethod, userData, messageContent) {
        const subject = 'Account Security Alert';
        const body = `Hello ${userData.name},\n\nYour account has been locked. ${messageContent}`;

        await notificationDeliveryMethod.deliver({
            subject,
            body,
            userData
        });

        console.log(`Sent account locked email to ${userData.email}`);
    }
}

// TokenService
class TokenService {
    async generateResetToken() {
        // Implement token generation logic
    }

    async storeResetToken(userId, resetToken) {
        // Implement token storage logic
    }
}

// NotificationFactory
class NotificationFactory {
    constructor(tokenService) {
        this.tokenService = tokenService;
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
}

// Usage example
const tokenService = new TokenService();
const notificationFactory = new NotificationFactory(tokenService);
const emailDeliveryMethod = new EmailDeliveryMethod('smtp.company.com', 587, 'welcome@company.com', 'username', 'password');

async function sendNotification(notificationType, userData, messageContent) {
    const notification = notificationFactory.createNotification(notificationType);
    await notification.send(emailDeliveryMethod, userData, messageContent);
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