class User {
  constructor() {
    this.activeUsers = [];
  }

  addUser(username) {
    if (!this.activeUsers.includes(username)) {
      this.activeUsers.push(username);
    }
    return this.activeUsers;
  }

  removeUser(username) {
    this.activeUsers = this.activeUsers.filter(user => user !== username);
    return this.activeUsers;
  }

  getUsers() {
    return this.activeUsers;
  }
}

module.exports = new User();
