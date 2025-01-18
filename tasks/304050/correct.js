/**
 * Base class defining the interface for notification delivery methods.
 * All delivery method implementations must extend this class.
 * 
 * @class NotificationDeliveryMethod
 */
class NotificationDeliveryMethod {
    /**
     * Sends a notification using the implemented delivery method.
     * 
     * @param {string} to - Recipient address
     * @param {string} subject - Notification subject
     * @param {string} body - Notification content
     * @param {string} from - Sender address
     * @returns {Promise<boolean>} Success status of the delivery
     * @throws {Error} When not implemented by subclass
     */
    async send(to, subject, body, from) {
      throw new Error('send() must be implemented by subclasses');
    }
  }
  
  /**
   * Email-based notification delivery implementation using SMTP protocol.
   * 
   * @class EmailDeliveryMethod
   * @extends NotificationDeliveryMethod
   */
  class EmailDeliveryMethod extends NotificationDeliveryMethod {
    /**
     * Creates an instance of EmailDeliveryMethod.
     * 
     * @param {Object} config - SMTP configuration
     * @param {string} config.host - SMTP host
     * @param {number} config.port - SMTP port
     * @param {boolean} config.secure - Use secure connection
     * @param {string} config.username - SMTP auth username
     * @param {string} config.password - SMTP auth password
     */
    constructor(config) {
      super();
      this.config = config;
      this.nodemailer = require('nodemailer');
      this.transporter = this.nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.username,
          pass: config.password
        }
      });
    }
  
    /**
     * Sends an email using configured SMTP transport.
     * 
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} body - Email body content
     * @param {string} from - Sender email address
     * @returns {Promise<boolean>} True if email sent successfully
     */
    async send(to, subject, body, from) {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        text: body
      });
      console.log(`Sent email to ${to}`);
      return true;
    }
  }
  
  /**
   * Base class defining the interface for different types of notifications.
   * All notification types must extend this class.
   * 
   * @class NotificationType
   */
  class NotificationType {
    /**
     * Creates an instance of NotificationType.
     * 
     * @param {NotificationDeliveryMethod} deliveryMethod - Method used to deliver notifications
     */
    constructor(deliveryMethod) {
      this.deliveryMethod = deliveryMethod;
    }
  
    /**
     * Sends a notification to the specified user.
     * 
     * @param {Object} userData - User information
     * @param {string} messageContent - Custom message content
     * @returns {Promise<boolean>} Success status of the notification
     * @throws {Error} When not implemented by subclass
     */
    async send(userData, messageContent) {
      throw new Error('send() must be implemented by subclasses');
    }
  
    /**
     * Retrieves email configuration for the notification type.
     * 
     * @returns {Object} Email configuration object
     * @throws {Error} When not implemented by subclass
     */
    getEmailConfig() {
      throw new Error('getEmailConfig() must be implemented by subclasses');
    }
  }
  
  /**
   * Welcome notification implementation for new users.
   * 
   * @class WelcomeNotification
   * @extends NotificationType
   */
  class WelcomeNotification extends NotificationType {
    /**
     * Sends a welcome notification to a new user.
     * 
     * @param {Object} userData - User information
     * @param {string} userData.name - User's name
     * @param {string} userData.email - User's email
     * @param {string} messageContent - Additional welcome message content
     * @returns {Promise<boolean>} Success status of the notification
     */
    async send(userData, messageContent) {
      const config = this.getEmailConfig();
      const body = `Hello ${userData.name},\n\nWelcome to our platform! ${messageContent}`;
      return await this.deliveryMethod.send(
        userData.email,
        config.subject,
        body,
        config.sender
      );
    }
  
    /**
     * Gets welcome email configuration.
     * 
     * @returns {Object} Email configuration
     * @returns {string} config.subject - Email subject
     * @returns {string} config.sender - Sender email address
     */
    getEmailConfig() {
      return {
        subject: 'Welcome to Our Platform',
        sender: 'welcome@company.com'
      };
    }
  }
  
  /**
   * Password reset notification implementation.
   * 
   * @class PasswordResetNotification
   * @extends NotificationType
   */
  class PasswordResetNotification extends NotificationType {
    /**
     * Creates an instance of PasswordResetNotification.
     * 
     * @param {NotificationDeliveryMethod} deliveryMethod - Delivery method
     * @param {TokenService} tokenService - Service for handling reset tokens
     */
    constructor(deliveryMethod, tokenService) {
      super(deliveryMethod);
      this.tokenService = tokenService;
    }
  
    /**
     * Sends a password reset notification with a reset token.
     * 
     * @param {Object} userData - User information
     * @param {string} userData.id - User's ID
     * @param {string} userData.name - User's name
     * @param {string} userData.email - User's email
     * @param {string} messageContent - Additional message content
     * @returns {Promise<boolean>} Success status of the notification
     */
    async send(userData, messageContent) {
      const config = this.getEmailConfig();
      const resetToken = await this.tokenService.generateToken();
      const body = `Hello ${userData.name},\n\nYou requested a password reset. ${messageContent}\nToken: ${resetToken}`;
      
      await this.tokenService.storeToken(userData.id, resetToken);
      return await this.deliveryMethod.send(
        userData.email,
        config.subject,
        body,
        config.sender
      );
    }
  
    /**
     * Gets password reset email configuration.
     * 
     * @returns {Object} Email configuration
     * @returns {string} config.subject - Email subject
     * @returns {string} config.sender - Sender email address
     */
    getEmailConfig() {
      return {
        subject: 'Password Reset Request',
        sender: 'security@company.com'
      };
    }
  }
  
  /**
   * Account locked notification implementation.
   * 
   * @class AccountLockedNotification
   * @extends NotificationType
   */
  class AccountLockedNotification extends NotificationType {
    /**
     * Sends an account locked notification.
     * 
     * @param {Object} userData - User information
     * @param {string} userData.name - User's name
     * @param {string} userData.email - User's email
     * @param {string} messageContent - Additional message content
     * @returns {Promise<boolean>} Success status of the notification
     */
    async send(userData, messageContent) {
      const config = this.getEmailConfig();
      const body = `Hello ${userData.name},\n\nYour account has been locked. ${messageContent}`;
      return await this.deliveryMethod.send(
        userData.email,
        config.subject,
        body,
        config.sender
      );
    }
  
    /**
     * Gets account locked email configuration.
     * 
     * @returns {Object} Email configuration
     * @returns {string} config.subject - Email subject
     * @returns {string} config.sender - Sender email address
     */
    getEmailConfig() {
      return {
        subject: 'Account Security Alert',
        sender: 'security@company.com'
      };
    }
  }
  
  /**
   * Service for managing password reset tokens.
   * 
   * @class TokenService
   */
  class TokenService {
    /**
     * Creates an instance of TokenService.
     */
    constructor() {
      this.tokens = new Map();
    }
  
    /**
     * Generates a random token for password reset.
     * 
     * @returns {Promise<string>} Generated token
     */
    async generateToken() {
      return Math.random().toString(36).substring(2, 15);
    }
  
    /**
     * Stores a token for a specific user.
     * 
     * @param {string} userId - User's ID
     * @param {string} token - Generated token
     * @returns {Promise<boolean>} Success status of token storage
     */
    async storeToken(userId, token) {
      this.tokens.set(userId, token);
      return true;
    }
  }
  
  /**
   * Factory for creating notification instances.
   * 
   * @class NotificationFactory
   */
  class NotificationFactory {
    /**
     * Creates an instance of NotificationFactory.
     * 
     * @param {Object} smtpConfig - SMTP configuration
     * @param {TokenService} tokenService - Token service instance
     */
    constructor(smtpConfig, tokenService) {
      this.emailDeliveryMethod = new EmailDeliveryMethod(smtpConfig);
      this.tokenService = tokenService;
    }
  
    /**
     * Creates a notification instance based on the specified type.
     * 
     * @param {string} type - Type of notification to create
     * @returns {NotificationType} Created notification instance
     * @throws {Error} When unknown notification type is specified
     */
    createNotification(type) {
      switch (type) {
        case 'welcome_email':
          return new WelcomeNotification(this.emailDeliveryMethod);
        case 'password_reset':
          return new PasswordResetNotification(this.emailDeliveryMethod, this.tokenService);
        case 'account_locked':
          return new AccountLockedNotification(this.emailDeliveryMethod);
        default:
          throw new Error(`Unknown notification type: ${type}`);
      }
    }
  }
  
  /**
   * Main function for sending notifications using the notification system.
   * 
   * @param {string} notificationType - Type of notification to send
   * @param {Object} userData - User information
   * @param {string} messageContent - Additional message content
   * @returns {Promise<boolean>} Success status of the notification
   */
  async function sendNotification(notificationType, userData, messageContent) {
    const smtpConfig = {
      host: 'smtp.company.com',
      port: 587,
      secure: false,
      username: 'username',
      password: 'password'
    };
  
    const tokenService = new TokenService();
    const factory = new NotificationFactory(smtpConfig, tokenService);
  
    try {
      const notification = factory.createNotification(notificationType);
      return await notification.send(userData, messageContent);
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