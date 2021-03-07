const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const {
  createNewGame,
  joinGame,
  calculateValue,
  createGameData,
  findGame
} = require("./utilities");
const FALLBACK_PORT = 4000;
const NEW_TURN = "turn";

let gamesState = [];
let connectedUsers = [];

io.on("connection", (socket) => {
  if (!connectedUsers.includes(socket.id)) {
    connectedUsers.push(socket.id);
  }

  // Join a game/ or create new game
  const startedGame = gamesState.find(
    (game) => game.playerTwo === null && game.winner === null
  );

  if (!startedGame) {
    const game = createNewGame(socket.id);
    gamesState.push(game);
    socket.join(game.id);
    io.to(game.id).emit("game", game);
  } else {
    gamesState = joinGame(gamesState, startedGame.id, socket.id);
    socket.join(startedGame.id);
    io.to(startedGame.id).emit(
      "game",
      findGame(gamesState, startedGame.id)
    );
  }

  // Listen for new turn/attempt
  socket.on(NEW_TURN, (data) => {
    let existingGame = data.gameData;
    const newValue = calculateValue(existingGame.value, data.selectedOption);
    const currentGameData = createGameData(data,existingGame,newValue,socket.id);
    io.in(existingGame.id).emit(NEW_TURN, currentGameData);
    if (newValue.value === 1) {
      io.to(socket.id).emit("won", existingGame);
     connectedUsers.forEach(userId => {
      if(userId != socket.id){
        io.to(userId).emit("lost", existingGame);
      }
     });
    }

  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
    const indexOfUser = connectedUsers.indexOf(socket.id);
    if (indexOfUser > -1) {
      connectedUsers.splice(indexOfUser, 1);
    }
    // remove the game from gameState where either of the user has disconnected
    gamesState= gamesState.filter(item => (item.playerOne?.id !== socket.id && item.playerTwo?.id !== socket.id))

    socket.leave(gamesState.id);
  });
});

server.listen(process.env.PORT || FALLBACK_PORT, () => {
  console.log(`Listening on port ${FALLBACK_PORT}`);
});
