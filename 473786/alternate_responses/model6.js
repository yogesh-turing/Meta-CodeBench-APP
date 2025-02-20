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
    if (!user.email || !user.phone) {
      return { success: false, message: '2FA cannot be initiated, contact details missing' };
    }
    if (user.isLocked) {
      return { success: false, message: 'Account locked due to multiple failed attempts.' };
    }

    const twoFactorCode = crypto.randomInt(100000, 999999);
    const twoFactorExpiry = Math.floor(Date.now() / 1000) + 30; // 30 seconds

    if (this.twoFactorStore.has(username)) {
      const existingDevices = this.twoFactorStore.get(username);
      existingDevices[device] = { twoFactorCode, twoFactorExpiry };
      this.twoFactorStore.set(username, existingDevices);
    } else {
      this.twoFactorStore.set(username, { [device]: { twoFactorCode, twoFactorExpiry } });
    }

    return { success: true, twoFactor: true, message: '2FA code sent. Please verify to complete login.' };
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
    if (Math.floor(Date.now() / 1000) > twoFactorExpiry) {
      delete userDevices[device];
      this.twoFactorStore.set(username, userDevices);
      return { success: false, message: '2FA code has expired' };
    }

    if (code !== twoFactorCode) {
      const failedCount = (this.failedAttempts.get(username) || 0) + 1;
      this.failedAttempts.set(username, failedCount);
      if (failedCount >= 3) {
        user.isLocked = true;
      }
      return { success: false, message: 'Incorrect 2FA code.' };
    }

    delete userDevices[device];
    this.twoFactorStore.set(username, userDevices);
    this.failedAttempts.delete(username);

    return { success: true, user };
  }
}

module.exports = AuthService;