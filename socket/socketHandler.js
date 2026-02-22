// socketHandler.js
const { gameState, startGame } = require('./crashGame');

const { getUserById, updateAmount } = require('../model/db');

module.exports = (io, sessionMiddleware) => {
  

  io.use((socket, next) => {
    const req = socket.request;
    if (!req.session.user) {
      console.log("❌ Unauthorized socket connection");
      socket.login = "Not";
      //return next(new Error("Authentication required"));
      return next();
      
    }
    
    socket.username = req.session.user.username;
    socket.sessionid = req.session.user.id;
    console.log("✅ User connected:", socket.username);
   // console.log(req.session)
    
  return  next();
  });

  



// Game Code

  io.on("connection", async (socket) => {
    
    
  //  Live Balance
 await livebalance(socket);
    

    socket.on("placeBet", async (data) => {
      
      if(socket.sessionid){
        const user = await getUserById(socket.sessionid);
  
  const newtk = user.Amount - parseFloat(data.amount);
  
 await updateAmount(user.id, newtk);
        await livebalance(socket);
        
      }
      
      
      if (!gameState.isRunning) {
        return socket.emit('error', { message: 'গেম চলমান নেই!' });
      }

      const existingPlayer = gameState.players.find(p => p.id === socket.id);
      if (existingPlayer) {
        return socket.emit('error', { message: 'আপনি ইতিমধ্যে বেট করেছেন!' });
      }

      const player = {
        id: socket.id,
        name: socket.username || "nikhil",
        amount: parseFloat(data.amount),
        betTime: new Date(),
        cashOutMultiplier: null,
        hasCashedOut: false,
        autoCashout: data.autoCashout || null
      };

      gameState.players.push(player);
      console.log(`💰 Bet placed: ${player.name} - ${player.amount} টাকা`);
console.log(gameState.players);


      io.emit('playerJoined', { player, totalPlayers: gameState.players.length });
      socket.emit('betSuccess', { message: `বেট সফল! ${player.amount} টাকা` });
      
      
    });

    socket.on("cashOut", async () => {
      
      
      
      
      
      const player = gameState.players.find(p => p.id === socket.id);
      if (!player || player.hasCashedOut) return;

      player.cashOutMultiplier = gameState.currentMultiplier;
      player.hasCashedOut = true;
      const winAmount = parseFloat((player.amount * gameState.currentMultiplier).toFixed(2));

if(socket.sessionid){
        const user = await getUserById(socket.sessionid);
       
  const newtk = user.Amount + parseFloat((player.amount * gameState.currentMultiplier).toFixed(2));;
  
 await updateAmount(user.id, newtk);
        await livebalance(socket);
        
      }



      socket.emit('cashOutSuccess', { amount: winAmount, multiplier: gameState.currentMultiplier });
      io.emit('playerCashedOut', { player, winAmount, multiplier: gameState.currentMultiplier });
      
      
      //await livebalance(socket);
    });

    socket.on("getGameState", () => {
      socket.emit('gameState', {
        isRunning: gameState.isRunning,
        currentMultiplier: gameState.currentMultiplier,
        players: gameState.players,
        history: gameState.history.slice(0, 10),
        gameId: gameState.gameId
      });
    });

    socket.on("disconnect", () => {
      
      console.log("❌ User disconnected:", socket.username || "null");
    });
  });

  // প্রথম গেম শুরু
  setTimeout(() => startGame(io), 1000);
  
  
  
  
  
};

  //LIVE BALAMCE
  async function livebalance(socket){
    
    if(socket.sessionid){
    const userb = await  getUserById(socket.sessionid);
    
    socket.emit("taka", {tk: userb.Amount.toFixed(2)});
    }else{
      
     socket.emit("taka", {tk: "Demo"}); 
      
    }
    
    
  }