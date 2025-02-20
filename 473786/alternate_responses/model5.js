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

    // Store 2FA code for this device
    const userDevices = this.twoFactorStore.get(username) || {};
    this.twoFactorStore.set(username, {
      ...userDevices,
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

    const userDevices = this.twoFactorStore.get(username);
    if (!userDevices || !userDevices[device]) {
      return { success: false, message: '2FA process not started' };
    }

    const { twoFactorCode, twoFactorExpiry } = userDevices[device];
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > twoFactorExpiry) {
      // Remove expired code
      delete userDevices[device];
      this.twoFactorStore.set(username, userDevices);
      return { success: false, message: '2FA code has expired' };
    }

    if (parseInt(code) !== twoFactorCode) {
      // Track failed attempts
      const currentFails = this.failedAttempts.get(username) || 0;
      this.failedAttempts.set(username, currentFails + 1);

      if (currentFails + 1 >= 3) {
        user.isLocked = true;
        this.failedAttempts.delete(username);
        return { success: false, message: 'Account locked due to multiple failed attempts.' };
      }

      return { success: false, message: 'Incorrect 2FA code.' };
    }

    // Success: clear 2FA code and failed attempts
    delete userDevices[device];
    this.twoFactorStore.set(username, userDevices);
    this.failedAttempts.delete(username);

    return { success: true, user };
  }
}

module.exports = AuthService;