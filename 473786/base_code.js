class AuthService {
  constructor(users) {
    // users: array of objects { username, password, email, phone }
    this.users = users;
  }

  login(username, password) {
    const user = this.users.find(u => u.username === username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }
    return { success: true, user };
  }
}

module.exports = AuthService;