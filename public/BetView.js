const hiddenInput = document.getElementById("hiddenId");
let prevS1 = 0, prevS2 = 0, prevPoints1 = 0, prevPoints2 = 0;
let fst = true;
let prevOdds = {};


// Modal
const modal = document.getElementById("placeBetModal");
const closeModalBtn = document.getElementById("closeModal");
const betInfoEl = document.getElementById("betInfo");
const betStakeEl = document.getElementById("betStake");
const confirmBetBtn = document.getElementById("confirmBet");

closeModalBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target===modal) modal.style.display = "none"; }


// Flash for scores
function flash(el){ 
  el.classList.add("flash"); 
  setTimeout(()=>el.classList.remove("flash"),1200); 
}

// Fetch and render match + odds
async function viewodds(){
    const matchscore = document.getElementById("matchscore");
    const res = await fetch(`/resview/${hiddenInput.value}`);
    const data = await res.json();

    const PS = data?.Value?.SC?.PS || [];
    const FS = data?.Value?.SC?.FS || {};
    const lastSet = PS.length>0 ? PS[PS.length-1].Value : {S1:0, S2:0, NF:"-"};

    if(fst){
        prevS1 = FS.S1??0; prevS2=FS.S2??0;
        prevPoints1 = data?.Value?.SC.SS?.S1??lastSet.S1??0;
        prevPoints2 = data?.Value?.SC.SS?.S2??lastSet.S2??0;
        fst = false;
    }

    matchscore.innerHTML = "";

    // Header
    const matchheader = document.createElement("div");
    matchheader.className = "match-header";
    matchheader.innerHTML = `<span class="title">${data?.Value?.SN==="Badminton"?"🏸":data?.Value?.SN==="Tennis"?"🎾":data?.Value?.SN==="Football"?"⚽️":data?.Value?.SN==="Cricket"?"🏏":""} ${data?.Value?.L||""}</span><span class="status live">LIVE</span>`;
    matchscore.appendChild(matchheader);

    // Teams
    const teams = document.createElement("div");
    teams.className = "teams";
    teams.innerHTML = `
        <div class="team">
            <span class="name">${data?.Value?.O1||"-"}</span>
            <span class="serve ${data?.Value?.SC.P=="1"?"":"off"}">🎾</span>
            <span class="score" id="score1">${FS.S1??0}</span>
            <span class="points" id="points1">${data?.Value?.SC.SS?.S1??lastSet.S1??0}</span>
        </div>
        <div class="vs">VS</div>
        <div class="team">
            <span class="name">${data?.Value?.O2||"-"}</span>
            <span class="serve ${data?.Value?.SC.P=="2"?"":"off"}">🎾</span>
            <span class="score" id="score2">${FS.S2??0}</span>
            <span class="points" id="points2">${data?.Value?.SC.SS?.S2??lastSet.S2??0}</span>
        </div>`;
    matchscore.appendChild(teams);

    // Flash scores
    const score1El = document.getElementById("score1");
    const score2El = document.getElementById("score2");
    const points1El = document.getElementById("points1");
    const points2El = document.getElementById("points2");

    if((FS.S1??0)!==prevS1) flash(score1El);
    if((FS.S2??0)!==prevS2) flash(score2El);
    if((data?.Value?.SC.SS?.S1??lastSet.S1??0)!==prevPoints1) flash(points1El);
    if((data?.Value?.SC.SS?.S2??lastSet.S2??0)!==prevPoints2) flash(points2El);

    prevS1 = FS.S1??0; prevS2 = FS.S2??0;
    prevPoints1 = data?.Value?.SC.SS?.S1??lastSet.S1??0;
    prevPoints2 = data?.Value?.SC.SS?.S2??lastSet.S2??0;

    // Sets
    const ttst = document.createElement("div");
    ttst.className = "newset";
    PS.forEach(s=>ttst.innerHTML+=`<div class="set-box"><span class="set-name">${s?.Value?.NF||"-"}</span><span class="set-score">${s?.Value?.S1??0}:${s?.Value?.S2??0}</span></div>`);
    matchscore.appendChild(ttst);

    // Odds
    const tabBox = document.getElementById("oddsdata");
    const GE = data?.Value?.GE || [];
    function renderOdds(targetGS=null){
        if(GE.length===0) return "<p>No odds available</p>";
        let html=`<div class="odds-wrapper">`;
        GE.forEach(group=>{
            if(targetGS && group.GS!==targetGS) return;
            html+=`<div class="market-group"><div class="market-title">${group.G === 1? "1X2" : group.G === 17? "Total Over/Under" :`Market G:${group.G}, GS:${group.GS}`}</div>`;
            group.E.forEach((row,rIndex)=>{
                html+=`<div class="odd-row">`;
                row.forEach((o,cIndex)=>{
                    const key=`${group.G}_${group.GS}_${rIndex}_${cIndex}`;
                    let flashClass = "";
                    if(prevOdds[key]!==undefined){
                        if(o.C>prevOdds[key]) flashClass="odds-increase";
                        else if(o.C<prevOdds[key]) flashClass="odds-decrease";
                    }
                    prevOdds[key] = o.C;

                    html+=`<div class="odd-box ${flashClass}">
                        <span class="odd-name">${o.T ===1 ? 'W1' : o.T === 3 ? "W2" : o.T === 2? "X" : o.T === 9 ? `Total over ${o.P}` 
                   : o.T === 10 ? `Total under ${o.P}` :o.P??''}</span>
                        <button class="odd-btn" onclick="openBetModal('${o.P}',${o.C})" ${o.B ? "disabled" : ""}>${o.C}</button>
                    </div>`;
                });
                html+=`</div>`;
            });
            html+=`</div>`;
        });
        html+=`</div>`;
        return html;
    }
oddsdata.innerHTML = renderOdds();
setTimeout(viewodds, 4000);
}

// Place Bet modal
function openBetModal(name, odd){
    betInfoEl.innerHTML = `Bet on: <b>${name}</b> at odds <b>${odd}</b>`;
    betStakeEl.value = "";
    modal.style.display = "flex";
}

// Confirm bet
confirmBetBtn.onclick = ()=>{
    const stake = betStakeEl.value;
    if(!stake || stake<=0){ alert("Enter valid stake"); return; }
    alert(`Bet Placed: ${betInfoEl.innerText}, Stake: ${stake}`);
    modal.style.display = "none";
}
 viewodds();