// middleware/admin.js
module.exports = function admin(req, res, next) {
  const jj = "5";
  if (jj === "5") {
    return next();
  }
  return res.json("/login"); // বা res.status(403)
};