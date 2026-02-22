
exports.ParamsBet = (req, res) => {
  
  res.render("BetView", { matchid: req.params.id});
  
}

exports.betapiview = async(req, res) =>{
  
  try{
  const url = `https://22play8.com/LiveFeed/GetGameZip?id=${req.params.matchid}&lng=en&tzo=6&isSubGames=true&GroupEvents=true&countevents=50&grMode=4&country=19&fcountry=19&marketType=1&mobi=true&isNewBuilder=true`;

const fdata = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",     // বা অন্য header প্রয়োজনে
      "Accept": "application/json"
    }
  });
const jjj = await fdata.json();
res.json(jjj);
  }catch{
    
    res.json("Not Match Id");
  }
}