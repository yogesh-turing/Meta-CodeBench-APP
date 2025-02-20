const crypto = require('crypto');

class AuthService {
  constructor(users) {
    this.users = users;
    this.twoFactorStore = new Map();
    this.consecutiveFailures = new Map();
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
      return { success: false, message: 'Account locked due to multiple failed attempts' };
    }

    const twoFactorCode = crypto.randomInt(100000, 999999);
    const twoFactorExpiry = Math.floor(Date.now() / 1000) + 30;

    if (!this.twoFactorStore.has(username)) {
      this.twoFactorStore.set(username, {});
    }
    this.twoFactorStore.get(username)[device] = { twoFactorCode, twoFactorExpiry };

    return { success: true, twoFactor: true, message: '2FA code sent. Please verify to complete login.' };
  }

  verifyTwoFactor(username, device, code) {
    const user = this.users.find(u => u.username === username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    if (!this.twoFactorStore.has(username) || !this.twoFactorStore.get(username)[device]) {
      return { success: false, message: '2FA process not started' };
    }
    const twoFactorRecord = this.twoFactorStore.get(username)[device];
    if (Math.floor(Date.now() / 1000) > twoFactorRecord.twoFactorExpiry) {
      delete this.twoFactorStore.get(username)[device];
      return { success: false, message: '2FA code has expired' };
    }
    if (twoFactorRecord.twoFactorCode !== code) {
      const consecutiveFailures = this.consecutiveFailures.get(username) || 0;
      this.consecutiveFailures.set(username, consecutiveFailures + 1);
      if (consecutiveFailures >= 2) {
        user.isLocked = true;
        return { success: false, message: 'Account locked due to multiple failed attempts' };
      }
      return { success: false, message: 'Incorrect 2FA code' };
    }
    delete this.twoFactorStore.get(username)[device];
    this.consecutiveFailures.set(username, 0);
    return { success: true, user };
  }
}

module.exports = AuthService;