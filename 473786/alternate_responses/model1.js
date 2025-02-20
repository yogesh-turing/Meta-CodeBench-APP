const crypto = require('crypto');

class AuthService {
  constructor(users) {
    this.users = users.map(user => ({ ...user, isLocked: false, failedAttempts: 0 }));
    this.twoFactorStore = new Map();
  }

  login(username, password, device) {
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.isLocked) {
      return { success: false, message: 'Account locked due to multiple failed attempts.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    if (!user.email || !user.phone) {
      return { success: false, message: '2FA cannot be initiated, contact details missing' };
    }

    // Generate and store 2FA code
    const twoFactorCode = crypto.randomInt(100000, 999999);
    const twoFactorExpiry = Math.floor(Date.now() / 1000) + 30; // 30 seconds from now

    const existingUserCodes = this.twoFactorStore.get(username) || {};
    this.twoFactorStore.set(username, {
      ...existingUserCodes,
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

    const userCodes = this.twoFactorStore.get(username);
    if (!userCodes || !userCodes[device]) {
      return { success: false, message: '2FA process not started' };
    }

    const { twoFactorCode, twoFactorExpiry } = userCodes[device];
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > twoFactorExpiry) {
      // Remove expired code
      delete userCodes[device];
      this.twoFactorStore.set(username, userCodes);
      return { success: false, message: '2FA code has expired' };
    }

    if (parseInt(code) !== twoFactorCode) {
      // Increment failed attempts
      user.failedAttempts += 1;
      
      if (user.failedAttempts >= 3) {
        user.isLocked = true;
        return { success: false, message: 'Account locked due to multiple failed attempts.' };
      }
      
      return { success: false, message: 'Incorrect 2FA code.' };
    }

    // Success: reset failed attempts and clear the code
    user.failedAttempts = 0;
    delete userCodes[device];
    this.twoFactorStore.set(username, userCodes);

    return { success: true, user: { 
      username: user.username,
      email: user.email,
      phone: user.phone
    }};
  }
}

module.exports = AuthService;