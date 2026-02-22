const express = require('express');
const router = express.Router();
const admin = require('../middleware/IsAdmin');

const file = require('../controller/FileManagerController');
const post = require('../controller/BlogController');
const jj = require('../db/nodesqlite');

// 🔒 সব route-এর আগে middleware
router.use(admin);


// /admin/data?page=1
router.get("/data", (req, res) => {
  const limit = 5;
  const after = req.query.after; // cursor

  let posts;

  if (after) {
    posts = jj.db.prepare(`
      SELECT id, title, content
      FROM posts
      WHERE id < ?
      ORDER BY id DESC
      LIMIT ?
    `).all(after, limit);
  } else {
    // first load
    posts = jj.db.prepare(`
      SELECT id, title, content
      FROM posts
      ORDER BY id DESC
      LIMIT ?
    `).all(limit);
  }

  res.json({
    posts,
    nextCursor: posts.length
      ? posts[posts.length - 1].id
      : null
  });
});

router.get('/', (req, res) => {
  const stats = jj.db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM posts) AS totalPosts
  `).get();

  res.render("admin/home", { stats });
});

router.get("/setting", (req, res) => {
  res.render("admin/Setting");
});

// Blog
router.get('/addpost', post.blogview);
router.post('/savepost', post.savepost);

// File Manager
router.get('/filemanager', file.fileview);
router.get('/fileapi', file.filesapi);
router.post('/filedelete', file.filedelete);
router.post('/fileupload',  file.fileupload);

module.exports = router;