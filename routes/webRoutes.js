// routes/webRoutes.js
const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controller/LoginController');
const SignUpController = require('../controller/SignupController');
const Home = require('../controller/HomeController');
const BetController = require('../controller/BetController');
const BetApiController = require('../controller/BetApiController');
const MessageView = require('../controller/MsgViewController');

const blog = require('../controller/BlogController');
const search = require('../controller/SearchController');
const push = require('../controller/PushController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');
//PushController
router.post("/subscribe", push.subscribe);
router.get("/sendpush", push.sendpush);


//SearchController
router.get('/searchview', search.searchview);
router.get('/search', search.searchpost);

router.get("/sse", async (req, res) => {
  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const logs = [
    "🔄 Starting deployment...",
    "📦 Installing dependencies",
    "📦 npm install completed",
    "🏗 Building project",
    "⚙ Optimizing assets",
    "🚀 Deploying to server",
    "✅ Deployment successful!"
  ];

  for (const line of logs) {
    res.write(`data: ${line}\n\n`);
    await sleep(800); // delay like real deploy
  }

  res.write("event: done\ndata: END\n\n");
  res.end();
});

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
let stats = {
  users: 120,
  active: 23,
  orders: 4
};


router.get("/rr", (req, res) => {
  // (এখানে চাইলে session / JWT check করবে)

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // initial data
  res.write(`data: ${JSON.stringify(stats)}\n\n`);

  // update every 2 sec (simulation)
  const timer = setInterval(() => {
    stats.active = Math.floor(Math.random() * stats.users);
    stats.orders += Math.random() > 0.7 ? 1 : 0;

    res.write(`data: ${JSON.stringify(stats)}\n\n`);
  }, 5000);

  // client disconnect
  req.on("close", () => {
    clearInterval(timer);
    res.end();
  });
});


//BLOG Routes
router.get('/post/:jj', blog.userblog)

//DEMO
router.get("/demo", (req, res) => {
  
  res.render("Demo");
});

//DHAN Routes


/* =========================
   Bet Routes
========================= */
router.get('/bet', BetController.bethome);
router.post('/placebet', BetController.placeBet);

// Bet API Get by ID
router.get('/bet/:id', BetApiController.ParamsBet);

// Bet API Response
router.get('/res', BetController.betapi);
router.get('/resview/:matchid', BetApiController.betapiview);

/* =========================
   Crash Page
========================= */
router.get('/crash', (req, res) => {
  res.render('crash', { user: req.session.user });
});
router.get('/cr', (req, res) => {
  res.render('CRW');
});

/* =========================
   Home Page
========================= */
router.get('/', Home.HomePage);

/* =========================
   Authentication Routes
========================= */
// Login
router.get('/login', authMiddleware, authController.showLogin);
router.post('/login', authMiddleware, authController.loginUser);

// Sign Up
router.get('/signup', authMiddleware, SignUpController.SignUp);
router.post('/signup', authMiddleware, SignUpController.SignUpPost);

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('সেশন মুছতে সমস্যা হয়েছে');
    }

    // Clear cookie
    res.clearCookie('connect.sid');

    // Redirect to login
    res.redirect('/login');
  });
});

/* =========================
   Chat Routes
========================= */
router.get('/chat', (req, res) => {
  /*if (!req.session.user) return res.redirect('/login');*/
  res.render('Chat');
});

router.get('/chat/:id', MessageView.chatview);
router.get('/recent', MessageView.rcmsg);


/* =========================
   404 Fallback (Keep Last)
========================= */
router.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

module.exports = router;