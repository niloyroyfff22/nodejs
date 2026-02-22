const { db } = require('../db/nodesqlite');

/* =========================
   SAVE MESSAGE
========================= */
function saveMessage(from_user, to_user, message, delivered = 0) {
  const stmt = db.prepare(`
    INSERT INTO messages (from_user, to_user, message, delivered)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(from_user, to_user, message, delivered);
  return stmt.lastInsertRowid;
}

/* =========================
   GET CHAT HISTORY
========================= */
function getMessages(user1, user2) {
  const stmt = db.prepare(`
    SELECT *
    FROM messages
    WHERE (from_user = ? AND to_user = ?)
       OR (from_user = ? AND to_user = ?)
    ORDER BY id ASC
  `);

  return stmt.all(user1, user2, user2, user1);
}

/* =========================
   GET PENDING (OFFLINE)
========================= */
function getPendingMessages(to_user) {
  const stmt = db.prepare(`
    SELECT *
    FROM messages
    WHERE to_user = ? AND delivered = 0
    ORDER BY id ASC
  `);

  return stmt.all(to_user);
}

/* =========================
   MARK DELIVERED
========================= */
function markDelivered(messageId) {
  const stmt = db.prepare(`
    UPDATE messages SET delivered = 1 WHERE id = ?
  `);
  stmt.run(messageId);
  return true;
}

/* =====================
   RECENT CHAT LIST
===================== */
/* =====================
   RECENT CHAT LIST
===================== */
function getRecentChats(userId) {
  const stmt = db.prepare(`
    SELECT
      u.id AS userid,
      u.username,
      m.message,
      m.created_at,
      SUM(
        CASE 
          WHEN m.to_user = ? AND m.delivered = 0 
          THEN 1 ELSE 0 
        END
      ) AS unread
    FROM messages m
    JOIN users u
      ON u.id = CASE
        WHEN m.from_user = ? THEN m.to_user
        ELSE m.from_user
      END
    WHERE m.from_user = ? OR m.to_user = ?
    GROUP BY u.id
    ORDER BY MAX(m.id) DESC
  `);

  return stmt.all(userId, userId, userId, userId);
}

module.exports = {
  saveMessage,
  getMessages,
  getPendingMessages,
  markDelivered,
  getRecentChats
};