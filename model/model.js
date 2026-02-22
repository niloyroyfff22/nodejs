const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

let db, SQL;

async function initDatabase() {
  SQL = await initSqlJs();

  const dbPath = path.join(__dirname, "../db/mydb.sqlite");

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log("✅ পুরাতন ডাটাবেস লোড হয়েছে");
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `);
    console.log("🆕 নতুন ডাটাবেস তৈরি হয়েছে");
  }
}

// ✅ ইউজার যোগ করার ফাংশন
function addUser(name, email) {
  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  stmt.run([name, email]);
  stmt.free();
}

// ✅ সব ইউজার ফেরত দেয়
function getAllUsers() {
  const stmt = db.prepare("SELECT * FROM users");
  const users = [];
  while (stmt.step()) {
    users.push(stmt.getAsObject());
  }
  stmt.free();
  return users;
}

// ✅ একটি নির্দিষ্ট ইউজার ফেরত দেয় ID দিয়ে
function getUserById(id) {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  stmt.bind([id]);
  if (stmt.step()) {
    const user = stmt.getAsObject();
    stmt.free();
    return user;
  }
  stmt.free();
  return null;
}

// ✅ ইউজার আপডেট করে
function updateUser(id, name, email) {
  const stmt = db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
  stmt.run([name, email, id]);
  stmt.free();
  console.log(`🔄 ইউজার আপডেট হয়েছে (ID=${id})`);
}

// ✅ ইউজার ডিলিট করে
function deleteUser(id) {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  stmt.run([id]);
  stmt.free();
  console.log(`🗑️ ইউজার ডিলিট হয়েছে (ID=${id})`);
}

// ✅ ডাটাবেস ফাইল হিসেবে সেভ করে
function saveToFile() {
  const binaryArray = db.export();
  const dbPath = path.join(__dirname, "../db/mydb.sqlite");
  fs.writeFileSync(dbPath, Buffer.from(binaryArray));
  console.log("💾 ডাটাবেস সেভ হয়েছে:", dbPath);
}

module.exports = {
  initDatabase,
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  saveToFile
};