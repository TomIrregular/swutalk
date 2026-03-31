const fs = require('fs');
const path = require('path');

const historyFilePath = path.join(__dirname, '..', 'chat_history.json');

// Initialize the file if it doesn't exist
if (!fs.existsSync(historyFilePath)) {
  fs.writeFileSync(historyFilePath, JSON.stringify([]));
}

class ChatHistoryDB {
  getMessages() {
    try {
      const data = fs.readFileSync(historyFilePath, 'utf8');
      const messages = JSON.parse(data);
      // Return only the latest 100 messages
      return messages.slice(-100);
    } catch (err) {
      console.error('Error reading chat_history.json', err);
      return [];
    }
  }

  saveMessage(messageData) {
    try {
      // We read the full history to append
      const data = fs.readFileSync(historyFilePath, 'utf8');
      const messages = JSON.parse(data);
      
      messages.push(messageData);
      
      // Optionally, we could limit the file size here by slicing it, 
      // e.g. keeping only the last 1000 messages on disk to prevent unbounded growth.
      // For now, we will just keep everything on disk and only send the last 100 to clients.
      
      fs.writeFileSync(historyFilePath, JSON.stringify(messages, null, 2));
    } catch (err) {
      console.error('Error writing to chat_history.json', err);
    }
  }
}

module.exports = new ChatHistoryDB();
