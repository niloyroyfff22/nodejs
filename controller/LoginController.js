const { getUserss } = require('../model/LoginModel');

// Dummy user data
/*const users = [
  { user: 'admin', pass: '12345' },
  { user: 'alice', pass: 'alicepass' },
];
*/
// GET /login
exports.showLogin = (req, res) => {
  
  let showSplash = true;
  res.locals.errors = req.flash('errorss')[0] || {};
  res.locals.oldInput = req.flash('oldInput')[0] || {};

  // যদি session-এ skipSplash থাকে → false
  if (req.session.skipSplash) {
    showSplash = false;
    // একবার show করার পর flag মুছে দাও
    delete req.session.skipSplash;
  }
  
  res.render('login', {showSplash});
};

// POST /login
exports.loginUser = async (req, res) => {
  const { user, pass } = req.body;
  const users =  getUserss();
  const errors = {};

  // ফাঁকা ইনপুট চেক
  if (!user || user.trim() === '') errors.user = 'নাম ফিল্ড খালি রাখা যাবে না';
  if (!pass || pass.trim() === '') errors.pass = 'পাসওয়ার্ড ফিল্ড খালি রাখা যাবে না';

  // ইউজার চেক
  let foundUser = null;
  if (Object.keys(errors).length === 0) {
    foundUser = users.find(u => u.username === user);

    if (!foundUser) {
      errors.user = 'এই নামে কোনো অ্যাকাউন্ট পাওয়া যায়নি';
    } else if (foundUser.password !== pass) {
      errors.pass = 'পাসওয়ার্ড সঠিক নয়';
    }
  }

  // যদি কোনো error থাকে
  if (Object.keys(errors).length > 0) {
    req.flash('errorss', errors);
    req.flash('oldInput', req.body);
    // ✅ Splash skip করার জন্য session flag
  req.session.skipSplash = true;

    return res.redirect('/login');
  }

  // Session এ user সংরক্ষণ
  req.session.user = {
    id: foundUser.id,
    username: foundUser.username
  };

  res.redirect('/');
};