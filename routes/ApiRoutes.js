const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = []; // DB preferred
const SECRET = "SUPERSECRETKEY";

// Signup
router.post('/signup', (req, res) => {
  console.log(users);
  const { user, pass } = req.body;
  if (!user || !pass) return res.status(400).json({ error: "Missing fields" });
  if (users.find(u => u.user === user)) return res.status(400).json({ error: "User exists" });

  users.push({ user, pass });
  res.json({ message: "Signup successful" });
});

// Login
router.post('/login', (req, res) => {
  
  const { user, pass } = req.body;
  const existing = users.find(u => u.user === user && u.pass === pass);
  if (!existing) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ user }, SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,  // prod: true
    sameSite: "lax",
    maxAge: 3600000 // 1 hour
  });

  res.json({ user });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// Me (protected)
router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = jwt.verify(token, SECRET);
    res.json({ user: payload.user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;