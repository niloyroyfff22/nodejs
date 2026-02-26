const socket = io();
const rand = Math.random();
//console.log(rand);

let currentMultiplier = 1.0;
let hasPlacedBet = false;
let gameRunning = false;
let userBalance = 10000;

let pendingBet = null;
//let pendingBet = null;

//const spinSound = new Audio('sound/background.mp3');

// DOM elements
const elements = {
    multiplier: document.getElementById("multiplier"),
    status: document.getElementById("status"),
    betAmount: document.getElementById("betAmount"),

    placeBetBtn: document.getElementById("placeBetBtn"),

    playersList: document.getElementById("playersList"),
    historyList: document.getElementById("historyList"),

    balance: document.getElementById("balance"),
    gameId: document.getElementById("gameId"),
    totalPlayers: document.getElementById("totalPlayers"),
    totalBets: document.getElementById("totalBets"),
    highestMultiplier: document.getElementById("highestMultiplier")
};

// Quick bet buttons
const quickBets = [10, 50, 100, 500, 1000, 5000];

// Initialize quick bets
function initializeQuickBets() {
    const quickBetsContainer = document.getElementById("quickBets");
    quickBets.forEach(amount => {
        const button = document.createElement("div");
        button.className = "quick-bet";
        button.textContent = amount;
        button.addEventListener("click", () => {
            elements.betAmount.value = amount;
        });
        quickBetsContainer.appendChild(button);
    });
}
//initializeQuickBets();

// Update balance display
function updateBalance() {
    elements.balance.textContent = "৳" + userBalance.toLocaleString();
}

socket.on("taka", data => {
    //console.log(data.tk);
    document.getElementById("taka").textContent = "৳" + data.tk;
});

// Game update handler
socket.on("gameUpdate", data => {
    gameRunning = true;
    currentMultiplier = data.multiplier;

    elements.multiplier.textContent = currentMultiplier.toFixed(2) + "xb";
    elements.multiplier.className = "multiplier rising";

    if (currentMultiplier < 2) {
        elements.multiplier.style.color = "var(--danger)";
    } else if (currentMultiplier < 10) {
        elements.multiplier.style.color = "var(--warning)";
    } else if (currentMultiplier < 30) {
        elements.multiplier.style.color = "var(--info)";
    } else {
        elements.multiplier.style.color = "var(--accent)";
    }

    elements.status.textContent = "Game Running...";
    elements.status.style.color = "var(--accent)";

    updatePlayersList(data.players);
    updateStats(data.players);
});

socket.on("gameStart", data => {
    gameRunning = true;

    //hasPlacedBet = false;

    if (pendingBet) {
        socket.emit("placeBet", { amount: pendingBet });

        console.log("geci");
        pendingBet = null; // Reset pending
    }

    elements.multiplier.textContent = "2.00x";
    elements.multiplier.className = "multiplier";
    elements.multiplier.style.color = "var(--text)";

    elements.status.textContent = `Game #${data.gameId} - Place Your Bets!`;
    elements.status.style.color = "var(--warning)";

    elements.gameId.textContent = data.gameId;

    showToast(
        `Game #${data.gameId} has started! Most games crash below 50x.`,
        "info"
    );
    resetBettingUI();
});

socket.on("gameCrash", data => {
    gameRunning = false;
    hasPlacedBet = false;

    AudioSys.play("plane-crash");
    //AudioSys.play('sound-win');
    //AudioSys.play('sound-crash');

    elements.multiplier.textContent = data.crashPoint.toFixed(2) + "x";
    elements.multiplier.className = "multiplier crashed";

    let statusMessage = `Crashed at ${data.crashPoint.toFixed(2)}x!`;
    if (data.crashPoint < 10) statusMessage += " (Low)";
    else if (data.crashPoint < 30) statusMessage += " (Medium)";
    else if (data.crashPoint < 50) statusMessage += " (High)";
    else statusMessage += " (RARE!)";

    elements.status.textContent = statusMessage;
    elements.status.style.color = "var(--danger)";

    showToast(`Game crashed at ${data.crashPoint.toFixed(2)}x!`, "error");
    updateHistory(data.history);

    if (!pendingBet) {
        //elements.placeBetBtn.textContent = 'PLACE BET';
        // elements.placeBetBtn.className = 'btn btn-bet';
        updateBettingUI(); // UI refresh
    }

    setTimeout(() => {
        elements.playersList.innerHTML =
            '<div class="player-item"><div class="player-info"><div class="player-avatar">?</div><span>No active players nj</span></div></div>';
    }, 3000);
});

//show tast msg
socket.on("betSuccess", data => {
    hasPlacedBet = true;
    userBalance -= parseFloat(elements.betAmount.value);
    updateBalance();

    showToast(`Bet placed! ${elements.betAmount.value} টাকা`, "success");
    //showMessage(`Bet placed! ${elements.betAmount.value} টাকা`, 'success');
    updateBettingUI();
});

//cashout success
socket.on("cashOutSuccess", data => {
    const winAmount = parseFloat(data.amount);
    userBalance += winAmount;
    updateBalance();
    showToast(
        `Success! You won ৳${winAmount.toLocaleString()}! (${data.multiplier}x)`,
        "success"
    );
    hasPlacedBet = false;
    updateBettingUI();
});

socket.on("playerJoined", data => {
    showToast(
        `${data.player.name} placed a bet of ৳${data.player.amount}!`,
        "info"
    );
});

socket.on("playerCashedOut", data => {
    showToast(
        `${data.player.name} won ৳${data.winAmount.toLocaleString()}!`,
        "success"
    );
});

socket.on("error", data => {
    showToast(data.message, "error");
});

socket.on("gameState", data => {
    gameRunning = data.isRunning;
    currentMultiplier = data.currentMultiplier;

    elements.multiplier.textContent = currentMultiplier.toFixed(2) + "x";
    updatePlayersList(data.players);
    updateHistory(data.history);
    updateStats(data.players);
    elements.gameId.textContent = data.gameId;

    if (!gameRunning) {
        elements.status.textContent = "New game starting soon...";
        elements.status.style.color = "var(--warning)";
    }
});

// Place Bet
function placeBet() {
    const amount = parseFloat(elements.betAmount.value);
    //playSound('sound/background.mp3');
    // যদি game চলছে → Pending রাখো
    if (gameRunning) {
        if (hasPlacedBet) {
            socket.emit("cashOut");
            return;
        } else if (pendingBet) {
            updateBettingUI();
            pendingBet = null; // Reset pending
            return;
        } else {
            showToast("running Please wait...", "error");
            pendingBet = amount;
            // showMessage('Game running... your bet will be placed next round!', 'info');
            elements.placeBetBtn.textContent = "Cancel";
            elements.placeBetBtn.className = "btn btn-cashout";
            // elements.placeBetBtn.disabled = true;

            console.log(pendingBet);
            return;
        }
    } else if (!gameRunning) {
        if (pendingBet) {
            pendingBet = null; // Reset pending
            updateBettingUI();
            return;
        } else {
            showToast("not running beting pending", "error");
            pendingBet = amount;
            elements.placeBetBtn.textContent = "Cancel";
            elements.placeBetBtn.className = "btn btn-cashout";
            return;
        }
    }

    if (!amount || amount < 10) {
        showMessage("Minimum bet amount is ৳10!", "error");
        return;
    }

    if (amount > userBalance) {
        showMessage("Insufficient balance!", "error");
        return;
    }

    //socket.emit('placeBet', { amount: amount});
}

// UI update
function updateBettingUI() {
    if (hasPlacedBet) {
        elements.placeBetBtn.disabled = false;
        elements.placeBetBtn.textContent = "Cash Out";
        elements.placeBetBtn.className = "btn btn-cashout";
    } else {
        //  elements.placeBetBtn.disabled = !gameRunning || userBalance < 10;
        elements.placeBetBtn.textContent = "PLACE BET";
        elements.placeBetBtn.className = "btn btn-bet";

        elements.placeBetBtn.disabled = false;
    }

    //  elements.betAmount.disabled = hasPlacedBet || !gameRunning;
    // elements.playerName.disabled = hasPlacedBet || !gameRunning;
}

function resetBettingUI() {
    hasPlacedBet = false;
    updateBettingUI();
}
// active player
function updatePlayersList(players) {
    elements.playersList.innerHTML = "";

    if (players.length === 0) {
        elements.playersList.innerHTML = `
            <div class="player-item">
                <div class="player-info">
                    <div class="player-avatar">?</div>
                    <span>No active players nj</span>
                </div>
            </div>
        `;
        return;
    }

    players.forEach(player => {
        const playerItem = document.createElement("div");
        playerItem.className = "player-item";
        const avatarText = player.name.charAt(0).toUpperCase();
        let status = "Playing";
        let amountInfo = `৳${player.amount}`;
        let multiplierInfo = currentMultiplier.toFixed(2) + "x";

        if (player.hasCashedOut) {
            status = "Cashed Out";
            amountInfo = `৳${(player.amount * player.cashOutMultiplier).toLocaleString()}`;
            multiplierInfo = player.cashOutMultiplier.toFixed(2) + "x";
        }

        playerItem.innerHTML = `
            <div class="player-info">
                <div class="player-avatar">${avatarText}</div>
                <div>
                    <div>${player.name}</div>
                    <div style="font-size: 0.8em; color: var(--text-secondary);">${status}</div>
                </div>
            </div>
            <div class="player-stats">
                <div class="player-amount">${amountInfo}</div>
                <div class="player-multiplier">${multiplierInfo}</div>
            </div>
        `;

        elements.playersList.appendChild(playerItem);
    });
}

function updateHistory(history) {
    elements.historyList.innerHTML = "";

    history.forEach(game => {
        const historyItem = document.createElement("div");
        let className = "history-item ";
        if (game.crashPoint < 2) className += "low";
        else if (game.crashPoint < 5) className += "medium";
        else if (game.crashPoint < 10) className += "high";
        else if (game.crashPoint < 30) className += "very-high";
        else className += "mega";
        historyItem.className = className;

        const date = new Date(game.timestamp);
        const time = date.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit"
        });

        historyItem.innerHTML = `
            <div class="history-multiplier">${game.crashPoint.toFixed(2)}x</div>
            <div class="history-time">${time}</div>
            <div class="history-category">${game.category}</div>
        `;

        elements.historyList.appendChild(historyItem);
    });
}

function updateStats(players) {
    elements.totalPlayers.textContent = players.length;
    elements.totalBets.textContent =
        "৳" +
        players
            .reduce((sum, player) => sum + player.amount, 0)
            .toLocaleString();
    const activePlayers = players.filter(p => !p.hasCashedOut);
    if (activePlayers.length > 0) {
        elements.highestMultiplier.textContent =
            currentMultiplier.toFixed(2) + "x";
    }
}

// Event listeners
elements.placeBetBtn.addEventListener("click", placeBet);

// Keyboard shortcuts
document.addEventListener("keydown", e => {
    if (e.code === "Space" && hasPlacedBet) {
        e.preventDefault();
        cashOut();
    }

    if (e.code >= "Digit1" && e.code <= "Digit6" && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const index = parseInt(e.code.replace("Digit", "")) - 1;
        if (quickBets[index]) elements.betAmount.value = quickBets[index];
    }
});

// Auto-focus bet amount
elements.betAmount.focus();

// Initialize
socket.emit("getGameState");
//initializeQuickBets();
updateBalance();
updateBettingUI();

//showToast('Bet placed! ৳100', 'success');
//showToast('Insufficient balance!', 'error');
//showToast('Waiting for next round...', 'info');
//showToast('Minimum bet is ৳10!', 'warning');

//countdown Interval

socket.on("countdown", time => {
    elements.status.textContent = `পরের গেম শুরু হবে ${time} সেকেন্ড পরে...`;
    elements.status.style.color = "var(--warning)";
});

socket.on("countdownEnd", () => {
    elements.status.textContent = "নতুন গেম শুরু হচ্ছে!";
    elements.status.style.color = "var(--accent)";
});
