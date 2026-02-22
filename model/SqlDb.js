const initSqlJs = require('sql.js');
const fs = require('fs');
const DB_PATH = 'mydb.sqlite';

async function loadDb() {
const SQL = await initSqlJs();
const fileBuffer = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH) : null;
const db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

// Table তৈরি (যদি না থাকে)
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    Amount decimal(10,2) NOT NULL DEFAULT 500.00
  )
`);


db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user INTEGER,
        to_user INTEGER,
        message TEXT,
        delivered INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
// 👉 যদি ফাইল না থাকে, তাহলে নতুন ফাইল সেভ করে দেবে
saveDB(db);
return db;
}

// Save DB to file
function saveDB(db) {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}


module.exports = { loadDb, DB_PATH, fs,saveDB };