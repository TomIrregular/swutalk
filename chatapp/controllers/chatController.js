const UserDB = require('../models/Database');

exports.index = (req, res) => {
  res.render('index');
};

exports.register = (req, res) => {
  res.render('register');
};

exports.chat = (req, res) => {
  if (!req.user || !req.user.username) {
    return res.redirect('/');
  }
  res.render('chat', { username: req.user.username });
};

exports.setupProfile = (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  if (req.user.username) {
    return res.redirect('/chat');
  }
  res.render('setup-profile');
};

exports.saveProfile = (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  const { username } = req.body;
  if (!username) {
    return res.render('setup-profile', { error: 'Username is required' });
  }
  
  UserDB.updateUser(req.user.googleId, { username });
  res.redirect('/chat');
};