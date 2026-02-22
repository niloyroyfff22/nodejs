const people = require("./people");
const pages = require("./pages");
const groups = require("./groups");
const posts = require("./posts");

module.exports = async function (q, type) {
  switch (type) {
    case "people":
      return { people: people(q) };
    case "pages":
      return { pages: pages(q) };
    case "groups":
      return { groups: groups(q) };
    case "posts":
      return { posts: posts(q) };
    default:
      return {
        people: people(q),
        pages: pages(q),
        groups: groups(q),
        posts: posts(q)
      };
  }
};