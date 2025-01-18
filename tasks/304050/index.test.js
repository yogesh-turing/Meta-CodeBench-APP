const {
    NotificationDeliveryMethod,
    EmailDeliveryMethod,
    WelcomeNotification,
    PasswordResetNotification,
    AccountLockedNotification,
    TokenService,
    NotificationFactory,
    sendNotification,
    NotificationType,
  } = require('./correct');
  
  // Mock nodemailer
  jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue(true),
    }),
  }));
  
  describe('Notification System', () => {
    // Mock delivery method for testing
    class MockDeliveryMethod extends NotificationDeliveryMethod {
      constructor() {
        super();
        this.sent = [];
      }
  
      async send(to, subject, body, from) {
        this.sent.push({ to, subject, body, from });
        return true;
      }
    }
  
    let mockDelivery;
    let tokenService;
    let userData;
  
    beforeEach(() => {
      mockDelivery = new MockDeliveryMethod();
      tokenService = new TokenService();
      userData = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
      };
      jest.clearAllMocks();
    });
  
    describe("EmailDeliveryMethod", () => {
      test("should send email successfully", async () => {
        const config = {
          host: "test.smtp.com",
          port: 587,
          secure: false,
          username: "test",
          password: "pass",
        };
  
        const delivery = new EmailDeliveryMethod(config);
        let result;
  
        if (typeof delivery.send === "function") {
          result = await delivery.send(
            "test@example.com",
            "Test Subject",
            "Test Body",
            "sender@example.com"
          );
        } else if (typeof delivery.deliver === "function") {
          result = await delivery.deliver(
            "test@example.com",
            "Test Subject",
            "Test Body",
            "sender@example.com"
          );
        } else {
          fail("Neither send nor deliver method is implemented");
        }
  
        expect(result).toBe(true);
      });
    });
  
    describe('TokenService', () => {
      test('should generate unique tokens', async () => {
        const token1 = await tokenService.generateToken();
        const token2 = await tokenService.generateToken();
  
        expect(typeof token1).toBe('string');
        expect(token1).not.toBe(token2);
      });
  
      test('should store tokens by user ID', async () => {
        const token = 'test-token';
        await tokenService.storeToken(userData.id, token);
  
        expect(tokenService.tokens.get(userData.id)).toBe(token);
      });
    });
  
    describe('WelcomeNotification', () => {
      test('should send welcome email with correct content', async () => {
        const notification = new WelcomeNotification(mockDelivery);
        const message = 'Get started here!';
  
        await notification.send(userData, message);
        const sent = mockDelivery.sent[0];
  
        expect(sent.to).toBe(userData.email);
        expect(sent.subject).toBe('Welcome to Our Platform');
        expect(sent.from).toBe('welcome@company.com');
        expect(sent.body).toContain(userData.name);
        expect(sent.body).toContain(message);
      });
    });
  
    describe('PasswordResetNotification', () => {
      test('should generate and store token before sending email', async () => {
        const storeTokenSpy = jest.spyOn(tokenService, 'storeToken');
        const notification = new PasswordResetNotification(
          mockDelivery,
          tokenService,
        );
        const message = 'Click the link to reset';
  
        await notification.send(userData, message);
        const sent = mockDelivery.sent[0];
  
        expect(storeTokenSpy).toHaveBeenCalled();
        expect(sent.to).toBe(userData.email);
        expect(sent.subject).toBe('Password Reset Request');
        expect(sent.from).toBe('security@company.com');
        expect(sent.body).toContain('Token:');
  
        storeTokenSpy.mockRestore();
      });
    });
  
    describe('AccountLockedNotification', () => {
      test('should send account locked email with correct content', async () => {
        const notification = new AccountLockedNotification(mockDelivery);
        const message = 'Multiple failed attempts detected';
  
        await notification.send(userData, message);
        const sent = mockDelivery.sent[0];
  
        expect(sent.to).toBe(userData.email);
        expect(sent.subject).toBe('Account Security Alert');
        expect(sent.from).toBe('security@company.com');
        expect(sent.body).toContain(message);
      });
    });
  
    describe('NotificationFactory', () => {
      let factory;
  
      beforeEach(() => {
        const smtpConfig = {
          host: 'test.smtp.com',
          port: 587,
          secure: false,
          username: 'test',
          password: 'pass',
        };
        factory = new NotificationFactory(smtpConfig, tokenService);
      });
  
      test('should create welcome notification', () => {
        const notification = factory.createNotification('welcome_email');
        expect(notification).toBeInstanceOf(WelcomeNotification);
      });
  
      test('should create password reset notification', () => {
        const notification = factory.createNotification('password_reset');
        expect(notification).toBeInstanceOf(PasswordResetNotification);
      });
  
      test('should create account locked notification', () => {
        const notification = factory.createNotification('account_locked');
        expect(notification).toBeInstanceOf(AccountLockedNotification);
      });
  
      test('should throw error for unknown notification type', () => {
        expect(() => factory.createNotification('unknown')).toThrow(Error);
      });
    });
  
    describe('sendNotification integration', () => {
      test('should successfully send welcome notification', async () => {
        const result = await sendNotification(
          'welcome_email',
          userData,
          'Welcome message',
        );
        expect(result).toBe(true);
      });
  
      test('should successfully send password reset notification', async () => {
        const result = await sendNotification(
          'password_reset',
          userData,
          'Reset instructions',
        );
        expect(result).toBe(true);
      });
  
      test('should handle unknown notification types', async () => {
        const result = await sendNotification(
          'unknown_type',
          userData,
          'Test message',
        );
        expect(result).toBe(false);
      });
    });
  
    describe('Notification Delivery Method Validation', () => {
      test('should throw error when send is not implemented NotificationDeliveryMethod', async () => {
        const deliveryMethod = new NotificationDeliveryMethod();
        await expect(
          deliveryMethod.send('to', 'subject', 'body', 'from'),
        ).rejects.toThrow();
      });
  
      test('should throw error when send is not implemented NotificationType', async () => {
        const deliveryMethod = new NotificationType();
        await expect(
          deliveryMethod.send('userData', 'messageContent'),
        ).rejects.toThrow();
      });
    });
  });