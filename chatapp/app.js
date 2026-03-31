require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const chatController = require('./controllers/chatController');
const User = require('./models/User');
const UserDB = require('./models/Database');
const ChatHistory = require('./models/ChatHistory');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your_client_id_here',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_client_secret_here',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    const email = profile.emails && profile.emails[0].value;
    if (!email || !email.endsWith('@g.swu.ac.th')) {
      return cb(null, false, { message: 'Only @g.swu.ac.th emails are allowed.' });
    }
    
    let user = UserDB.findUserByGoogleId(profile.id);
    if (!user) {
      user = UserDB.createUser({
        googleId: profile.id,
        email: email,
        username: null
      });
    }
    return cb(null, user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.googleId);
});

passport.deserializeUser(function(id, done) {
  const user = UserDB.findUserByGoogleId(id);
  done(null, user);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_fallback',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', chatController.index);
app.get('/register', (req, res) => res.redirect('/'));
app.get('/chat', chatController.chat);
app.get('/setup-profile', chatController.setupProfile);
app.post('/setup-profile', chatController.saveProfile);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/?error=invalid_email' }),
  function(req, res) {
    if (!req.user.username) {
      res.redirect('/setup-profile');
    } else {
      res.redirect('/chat');
    }
  });

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.username = username;
    const users = User.addUser(username);
    socket.emit('chat history', ChatHistory.getMessages());
    socket.broadcast.emit('user joined', username);
    io.emit('users update', users);
  });

  socket.on('chat message', (data) => {
    const message = {
      username: socket.username,
      message: data.message,
      time: new Date().toLocaleTimeString()
    };
    ChatHistory.saveMessage(message);
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
