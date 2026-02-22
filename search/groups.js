const { fuzzySearch } = require("./fuzzy");

const groups = [
  { id: 1, name: "Web Developers" },
  { id: 2, name: "NodeJS Learners" }
];

module.exports = q => fuzzySearch(q, groups, "name");