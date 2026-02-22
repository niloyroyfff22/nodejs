

// Place Bet (POST)
// controllers/betController.js


exports.placeBet = async (req, res) => {
  try {
    const {
      matchId,
      team,          // "A" | "B" | "X"
      optionKey,     // nested odds unique key (only for X)
      amount,
      odds
    } = req.body;

    /* =====================
       BASIC VALIDATION
    ===================== */
    if (!matchId)
      return res.status(400).json({
        success: false,
        message: "❌ Match ID missing"
      });

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return res.status(400).json({
        success: false,
        message: "❌ Invalid bet amount"
      });

    if (!odds || isNaN(odds))
      return res.status(400).json({
        success: false,
        message: "❌ Invalid odds"
      });

    /* =====================
       FETCH LIVE DATA
    ===================== */
    const FEED_URL =
      "https://22play8.com/LiveFeed/Get1x2_VZip?sports=4&count=50&lng=en_GB&gr=322&mode=4&country=19&partner=151&getEmpty=true";

    const resp = await fetch(FEED_URL);
    if (!resp.ok) throw new Error("Live feed error");

    const feed = await resp.json();

    const match = feed?.Value?.find(
      m => String(m.I) === String(matchId)
    );

    if (!match)
      return res.status(404).json({
        success: false,
        message: "❌ Match not found"
      });

    /* =====================
       FIND SERVER ODDS
    ===================== */
    let serverOdds = null;

    // 🔹 Main market
    if (team === "A") {
      serverOdds = match.E?.[0]?.C;
    } else if (team === "B") {
      serverOdds = match.E?.[1]?.C;
    }

    // 🔹 Nested / extra market
    if (team === "X") {
      if (!optionKey)
        return res.status(400).json({
          success: false,
          message: "❌ Bet option missing"
        });

      match.AE?.forEach(ae => {
        ae.ME?.forEach(me => {
          const key = `${match.I}_${me.CE}_${me.T}_${me.P}`;
          if (key === optionKey) {
            serverOdds = me.C;
          }
        });
      });
    }

    if (!serverOdds)
      return res.status(400).json({
        success: false,
        message: "❌ Server odds unavailable"
      });

    /* =====================
       ODDS MISMATCH CHECK
    ===================== */
    if (Number(serverOdds) !== Number(odds)) {
      return res.status(409).json({
        success: false,
        message: `⚠️ Odds changed`,
        newOdds: serverOdds
      });
    }

    /* =====================
       PLACE BET (MOCK)
       👉 এখানে DB insert হবে
    ===================== */
    const betSlip = {
      matchId,
      team,
      optionKey: optionKey || null,
      stake: Number(amount),
      odds: Number(serverOdds),
      placedAt: new Date()
    };

    // await Bet.create(betSlip);

    /* =====================
       SUCCESS
    ===================== */
    return res.json({
      success: true,
      message: "✅ Bet placed successfully",
      data: betSlip
    });

  } catch (err) {
    console.error("❌ Bet Error:", err);
    return res.status(500).json({
      success: false,
      message: "⚠️ Server error, please try again"
    });
  }
};




//Bet Home Page

exports.bethome = (req, res) => {
  
  res.render('bet');
}



// Bet json API
exports.betapi = async(req, res) =>{
  try{
  const url = "https://22play8.com/LiveFeed/Get1x2_VZip?sports=4&count=50&lng=en_GB&gr=322&mode=4&country=19&partner=151&getEmpty=true";

const fdata = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",     // বা অন্য header প্রয়োজনে
      "Accept": "application/json"
    }
  });
const jjj = await fdata.json();
res.set("Content", "Nikhil"); // header set
res.json(jjj);
  }catch(err){
    //console.log("nao internet:" + err)
    chalk(err);
    res.end();
    
  }
}