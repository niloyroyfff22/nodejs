const  search  = require("../search");


exports.searchview = (req, res) => {
  
  res.render("search");
}


exports.searchpost = async (req, res) => {
  const q = req.query.q || "";
  const type = req.query.type || "all";

  if (q.length < 2) return res.json({});

  const result = await search(q, type);
  res.json(result);
}