// middleware/authMiddleware.js

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    // ❌ ইউজার logged in না → login page এ redirect করো
  return res.redirect('/');
  }
  return next(); // ✅ ইউজার logged in → route এ যেতে দাও

  
}

module.exports = isAuthenticated;