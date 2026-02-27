// server.js
const express = require('express');
require('dotenv').config();
const cookieParser = require("cookie-parser");

const http = require('http');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');


const session = require('express-session');
const flash = require('connect-flash');
const JSONFileStore = require('./helper/jsonFileStore'); // Custom JSON session store
const FileStore = require('session-file-store')(session);

//WebSocket

const WebSocket = require("ws");
//const { Server } = require('socket.io');
const initWebSocket = require("./ws/wsServer");

// Controllers / Socket handlers
const socketHandler = require('./socket/socketHandler'); // Crash socket


// Routes
const webRoutes = require('./routes/webRoutes');
const ApiRoutes = require('./routes/ApiRoutes');
const AdminRoutes = require('./routes/AdminRoutes');


const app = express();
const server = http.createServer(app);
//const io = new Server(server);

const wss = new WebSocket.Server({ noServer: true });


//CHALK COLOR SYSTEM
global.chalk = (data) =>{

console.log(chalk.red.bold('❌ Error!:', data));
}



/* =========================
   Session + Flash Config
========================= */
const sessionMiddleware = session({
  store: new JSONFileStore({ filePath: './helper/sessions.json',
 // ttl: 60,
//  reapInterval: 60,     // প্রতি 60 সেকেন্ডে expired sessions clean
 // reapOnStart: true,  // app start হলে expired sessions sweep করবে
 // retries: 1
  }),
  secret: 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, 
 // maxAge: 1000 * 60  // 1 minute = 60000ms
  }
});

app.use(sessionMiddleware);
app.use(flash());
app.use(cookieParser()); // ✅ cookie access

// Make flash & session variables available in all views
app.use((req, res, next) => {
  res.locals.dev = 'dev';
  //res.locals.errors = req.flash('errorss')[0] || {};
  //res.locals.oldInput = req.flash('oldInput')[0] || {};
  res.locals.session = req.session || {};
 // res.locals.errors = req.session || {};
  //res.locals.oldInput = req.session || {};
  next();
});

/* =========================
   View Engine (EJS)
========================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =========================
   Middleware
========================= */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); //Parse JSON
app.use(express.static(path.join(__dirname, 'public'))); // Static files

/* =========================
   Routes
========================= */
app.use('/admin', AdminRoutes);
app.use('/api', ApiRoutes);


app.use('/spa', express.static('client/dist'));

app.get(/^\/spa(\/.*)?$/, (req, res) => {
  res.sendFile(path.resolve('client/dist/index.html'));
});


app.use('/', webRoutes);

/* =====================
     HTTP → WS UPGRADE
  ====================== */
  server.on("upgrade", (req, socket, head) => {
    sessionMiddleware(req, {}, () => {

      // 🔐 require login
      if (!req.session || !req.session.user) {
        socket.destroy();
        return;
      }

      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit("connection", ws, req);
      });
    });
  });
/* =====================
   INIT WEBSOCKET
===================== */
initWebSocket(wss);




/* =========================
   Socket.IO Handlers
========================= */
/*io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });*/


//socketHandler(io, sessionMiddleware);
// Crash socket (if needed)

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  
  console.log(chalk.green.bold(`Server running at http://localhost:${PORT}`));
});