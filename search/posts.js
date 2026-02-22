const { fuzzySearch } = require("./fuzzy");

const posts = [
  { id: 1, content: "Learning Node js is awesome" },
  { id: 2, content: "Facebook style search system" }
];

module.exports = q => fuzzySearch(q, posts, "content");