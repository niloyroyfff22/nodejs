function normalize(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function score(query, target) {
  query = normalize(query);
  target = normalize(target);

  let match = 0;
  for (const ch of query) {
    if (target.includes(ch)) match++;
  }

  return match / target.length;
}

function fuzzySearch(query, list, key) {
  return list
    .map(item => ({
      ...item,
      _score: score(query, item[key])
    }))
    .filter(i => i._score > 0.25)
    .sort((a, b) => b._score - a._score)
    .slice(0, 10);
}

module.exports = { fuzzySearch };