const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const chatController = require('./controllers/chatController');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', chatController.index);
app.get('/chat', chatController.chat);
app.get('/register', chatController.register);

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.username = username;
    const users = User.addUser(username);
    socket.broadcast.emit('user joined', username);
    io.emit('users update', users);
  });

  socket.on('chat message', (data) => {
    const message = {
      username: socket.username,
      message: data.message,
      time: new Date().toLocaleTimeString()
    };
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      const users = User.removeUser(socket.username);
      socket.broadcast.emit('user left', socket.username);
      io.emit('users update', users);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
