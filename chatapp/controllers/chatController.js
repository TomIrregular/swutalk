exports.index = (req, res) => {
  res.render('index');
};

exports.chat = (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.redirect('/');
  }
  res.render('chat', { username });
};

exports.register = (req, res) => {
  res.render('register');
}