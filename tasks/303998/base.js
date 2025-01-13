class UserAuthService {
    constructor() {
        this.users = new Map();
    }

    async authenticateUser(email, password) {
        const user = this.users.get(email);
        
        if (user && user.password === password) {
            return {
                success: true,
                userId: user.id
            };
        }

        return {
            success: false,
            message: 'Invalid credentials'
        };
    }

    addUser(email, password) {
        const id = Math.random().toString(36).substr(2, 9);
        this.users.set(email, { id, password });
        return id;
    }
}

module.exports = { UserAuthService };