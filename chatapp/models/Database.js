const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'users.json');

// Initialize the file if it doesn't exist
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

class UserDB {
  getUsers() {
    try {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading users.json', err);
      return [];
    }
  }

  saveUsers(users) {
    try {
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (err) {
      console.error('Error writing to users.json', err);
    }
  }

  findUserByGoogleId(googleId) {
    const users = this.getUsers();
    return users.find(u => u.googleId === googleId);
  }

  createUser(userData) {
    const users = this.getUsers();
    users.push(userData);
    this.saveUsers(users);
    return userData;
  }

  updateUser(googleId, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.googleId === googleId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
      return users[index];
    }
    return null;
  }
}

module.exports = new UserDB();
