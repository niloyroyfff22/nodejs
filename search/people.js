const { fuzzySearch } = require("./fuzzy");

const users = [
  { id: 1, name: "Nikhil Roy" },
  { id: 2, name: "Rahman Hossain" },
  { id: 3, name: "Sabbir Ahmed" }
];

module.exports = q => fuzzySearch(q, users, "name");