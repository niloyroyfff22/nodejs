const jj = require('../db/nodesqlite');

function quillToHighlight(html) {
  return html.replace(
    /<pre class="ql-syntax"[^>]*>([\s\S]*?)<\/pre>/g,
    (match, code) => {
      return `<pre><code class="language-js">${code}</code></pre>`;
    }
  );
}


exports.userblog = (req, res) => {
  const post = jj.db
    .prepare("SELECT * FROM posts WHERE id = ?")
    .get(req.params.jj);
  if (!post) {
    return res.status(404).send("Post not found");
  }

post.content = quillToHighlight(post.content);
  res.render("Blog", {
    post: post
  });
};






exports.blogview = (req, res) =>{
  
  res.render("admin/PostAdd");
}


exports.savepost = (req, res) =>{
  const {title, content } = req.body;
 // console.log(req.body)
  /* Insert */
  const insert = jj.db.prepare(
    'INSERT INTO posts (title , content) VALUES (?, ?)'
  );
  insert.run(title, content);
  
  res.json({ success: true, post: content });
  //console.log(content)
  
}