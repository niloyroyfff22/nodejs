const jj = require('../db/nodesqlite');


exports.loginm = (name , pass) => {
  
  jj.db.prepare(
  "SELECT * FROM posts WHERE id = ?"
).get(id);
  
}


exports.getUserss = (name , pass) => {
  
  return jj.db.prepare(
  "SELECT * FROM users"
).all();
  
}