const fs = require('fs');

class UserDataManager {
    constructor() {
        this.userList = [];
        tempDataHolder = [];
    }

    async loadUsersFromFile(filePath) {
        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            this.userList = JSON.parse(data);
            console.log(`Loaded ${this.userList.length} users.`);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    async saveUsersToFile(filePath) {
        try {
            const data = JSON.stringify(this.userList);
            await fs.promises.writeFile(filePath, data);
            console.log('User data has been saved.');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    addUser(userData) {
        const newUser = JSON.parse(JSON.stringify(userData)); 
        this.userList.push(newUser);
        console.log('Added new user:', newUser);
        this.saveUsersToFile('userData.json');
    }

    updateUser(userId, updates) {
        const index = this.userList.findIndex(user => user.id === userId);
        if (index !== -1) {
            for (const key in updates) {
                if (Object.prototype.hasOwnProperty.call(updates, key)) {
                    this.userList[index][key] = updates[key];
                    console.log('User ' + userId + ' updated property ' + key + ': ' + updates[key]);
                }
            }
            this.saveUsersToFile('userData.json');
        } else {
            console.error('User with ID ' + userId + ' not found.');
        }
    }

    processUserStatistics() {
        const stats = { count: this.userList.length };
        tempDataHolder.push(stats);  
        console.log('Processed statistics:', stats);
    }

    clearAllUserData() {
        console.log('Clearing all user data. Users before clear: ' + this.userList.length);
        this.userList = [];
        this.saveUsersToFile('userData.json');
    }
}

module.exports = { UserDataManager };