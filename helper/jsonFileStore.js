const session = require('express-session');
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class JSONFileStore extends session.Store {
  constructor(options = {}) {
    super();
    this.filePath = options.filePath || path.join(__dirname, 'sessions.json');

    // ফাইল না থাকলে খালি JSON ফাইল তৈরি করবে
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}), 'utf8');
    }
  }

  async _readSessions() {
  try {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.warn('Invalid JSON, resetting sessions file');
    fs.writeFileSync(this.filePath, '{}');
    return {};
  }
}
  
  

  async _writeSessions(sessions) {
    await writeFile(this.filePath, JSON.stringify(sessions, null, 2), 'utf8');
  }

  get(sid, callback) {
    this._readSessions()
      .then(sessions => callback(null, sessions[sid] || null))
      .catch(err => callback(err));
  }

  set(sid, session, callback) {
    this._readSessions()
      .then(sessions => {
        sessions[sid] = session;
        return this._writeSessions(sessions);
      })
      .then(() => callback(null))
      .catch(err => callback(err));
  }

  destroy(sid, callback) {
    this._readSessions()
      .then(sessions => {
        delete sessions[sid];
        return this._writeSessions(sessions);
      })
      .then(() => callback(null))
      .catch(err => callback(err));
  }
}

module.exports = JSONFileStore;