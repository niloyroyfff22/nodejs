const { fuzzySearch } = require("./fuzzy");

const pages = [
  { id: 1, title: "NodeJS Community" },
  { id: 2, title: "Facebook Search System" }
];

module.exports = q => fuzzySearch(q, pages, "title");