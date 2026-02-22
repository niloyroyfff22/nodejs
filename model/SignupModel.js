const jj = require('../db/nodesqlite');


exports.signupm = (name , pass) => {
  
  jj.db.prepare(
  "INSERT INTO users (username, password) VALUES (?, ?)"
).run(name , pass);
  
}