const crypto = require('crypto');

class AuthService {
  constructor(users) {
    this.users = users;
    this.twoFactorStore = new Map();
    this.failedAttempts = new Map();
  }

  login(username, password, device) {
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    if (user.isLocked) {
      return { success: false, message: 'Account locked due to multiple failed attempts.' };
    }

    if (!user.email || !user.phone) {
      return { success: false, message: '2FA cannot be initiated, contact details missing' };
    }

    // Generate 2FA code
    const twoFactorCode = crypto.randomInt(100000, 999999);
    const twoFactorExpiry = Math.floor(Date.now() / 1000) + 30; // 30 seconds from now

    // Store 2FA code
    const userTwoFactorData = this.twoFactorStore.get(username) || {};
    this.twoFactorStore.set(username, {
      ...userTwoFactorData,
      [device]: { twoFactorCode, twoFactorExpiry }
    });

    return {
      success: true,
      twoFactor: true,
      message: "2FA code sent. Please verify to complete login."
    };
  }

  verifyTwoFactor(username, device, code) {
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.isLocked) {
      return { success: false, message: 'Account locked due to multiple failed attempts.' };
    }

    const userTwoFactorData = this.twoFactorStore.get(username);
    if (!userTwoFactorData || !userTwoFactorData[device]) {
      return { success: false, message: '2FA process not started' };
    }

    const { twoFactorCode, twoFactorExpiry } = userTwoFactorData[device];
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > twoFactorExpiry) {
      // Remove expired code
      delete userTwoFactorData[device];
      this.twoFactorStore.set(username, userTwoFactorData);
      return { success: false, message: '2FA code has expired' };
    }

    if (parseInt(code) !== twoFactorCode) {
      // Track failed attempts
      const currentFailures = this.failedAttempts.get(username) || 0;
      this.failedAttempts.set(username, currentFailures + 1);

      if (currentFailures + 1 >= 3) {
        // Lock the account
        const userIndex = this.users.findIndex(u => u.username === username);
        this.users[userIndex].isLocked = true;
        this.failedAttempts.delete(username);
        return { success: false, message: 'Account locked due to multiple failed attempts.' };
      }

      return { success: false, message: 'Incorrect 2FA code.' };
    }

    // Success - reset failed attempts and clear 2FA code
    this.failedAttempts.delete(username);
    delete userTwoFactorData[device];
    this.twoFactorStore.set(username, userTwoFactorData);

    return { success: true, user };
  }
}

module.exports = AuthService;