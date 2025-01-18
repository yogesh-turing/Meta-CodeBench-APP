// Define the NotificationDeliveryMethod base class
class NotificationDeliveryMethod {
  async deliver(notification) {
      throw new Error('Must be implemented by subclasses');
  }
}

// Implement the EmailDeliveryMethod class
class EmailDeliveryMethod extends NotificationDeliveryMethod {
  constructor(smtpConfig) {
      super();
      this.smtpConfig = smtpConfig;
  }

  async deliver(notification) {
      const transporter = nodemailer.createTransport(this.smtpConfig);
      await transporter.sendMail({
          from: notification.sender,
          to: notification.recipient,
          subject: notification.subject,
          text: notification.body
      });
  }
}

// Define the NotificationType base class
class NotificationType {
  async buildNotification(userData, messageContent) {
      throw new Error('Must be implemented by subclasses');
  }
}

// Implement the WelcomeNotification class
class WelcomeNotification extends NotificationType {
  async buildNotification(userData, messageContent) {
      return {
          subject: 'Welcome to Our Platform',
          body: `Hello ${userData.name},\n\nWelcome to our platform! ${messageContent}`,
          sender: 'welcome@company.com',
          recipient: userData.email
      };
  }
}

// Implement the PasswordResetNotification class
class PasswordResetNotification extends NotificationType {
  constructor(tokenService) {
      super();
      this.tokenService = tokenService;
  }

  async buildNotification(userData, messageContent) {
      const resetToken = await this.tokenService.generateToken(userData.id);
      return {
          subject: 'Password Reset Request',
          body: `Hello ${userData.name},\n\nYou requested a password reset. ${messageContent}\nToken: ${resetToken}`,
          sender: 'security@company.com',
          recipient: userData.email
      };
  }
}

// Implement the AccountLockedNotification class
class AccountLockedNotification extends NotificationType {
  async buildNotification(userData, messageContent) {
      return {
          subject: 'Account Security Alert',
          body: `Hello ${userData.name},\n\nYour account has been locked. ${messageContent}`,
          sender: 'security@company.com',
          recipient: userData.email
      };
  }
}

// Define the TokenService class
class TokenService {
  async generateToken(userId) {
      // Implement token generation logic here
      // For demonstration purposes, return a random token
      return Math.random().toString(36).substr(2, 10);
  }

  async storeToken(userId, token) {
      // Implement token storage logic here
      // For demonstration purposes, log the token
      console.log(`Stored token for user ${userId}: ${token}`);
  }
}

// Define the NotificationFactory class
class NotificationFactory {
  constructor(deliveryMethod, tokenService) {
      this.deliveryMethod = deliveryMethod;
      this.tokenService = tokenService;
  }

  async createNotification(notificationType, userData, messageContent) {
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

      const notificationData = await notification.buildNotification(userData, messageContent);
      await this.deliveryMethod.deliver(notificationData);
      console.log(`Sent ${notificationType} notification to ${userData.email}`);
      return true;
  }
}

// Example usage:
const smtpConfig = {
  host: 'smtp.company.com',
  port: 587,
  secure: false,
  auth: {
      user: 'username',
      pass: 'password'
  }
};

const deliveryMethod = new EmailDeliveryMethod(smtpConfig);
const tokenService = new TokenService();
const notificationFactory = new NotificationFactory(deliveryMethod, tokenService);

const userData = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
const messageContent = 'This is a test notification';

notificationFactory.createNotification('welcome_email', userData, messageContent)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

notificationFactory.createNotification('password_reset', userData, messageContent)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

notificationFactory.createNotification('account_locked', userData, messageContent)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));


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