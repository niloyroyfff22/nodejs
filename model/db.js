// db.js
const { loadDb, DB_PATH, fs,saveDB } = require('./SqlDb');






async function getUsers() {
const db = await loadDb();
const result = db.exec("SELECT * FROM users;");
const columns = result[0]?.columns || [];
const rows = result[0]?.values || [];

return rows.map(row =>
Object.fromEntries(columns.map((col, i) => [col, row[i]]))
);
}

async function createUser(username, password) {
const db = await loadDb();
db.run("INSERT INTO users (username, password) VALUES (?, ?);", [username, password]);

const result = db.exec("SELECT last_insert_rowid() as id;");
const id = result[0].values[0][0];

// Save DB to file
saveDB(db);

return { id, username };
}


async function updateAmount(id, newAmount) {
  const db = await loadDb();

  // Amount আপডেট করা
  db.run("UPDATE users SET Amount = ? WHERE id = ?;", [newAmount, id]);

  // ফাইল সেভ করা (কারণ sql.js ইন-মেমরি কাজ করে)
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));

 // return { username, newAmount };
}


async function getUserById(id) {
  const db = await loadDb();
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  stmt.bind([id]);
  const result = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
  return result;
}

module.exports = { getUsers, createUser, updateAmount, getUserById };


