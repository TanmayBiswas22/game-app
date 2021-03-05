const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_TURN = "turn";

let gamesState = [];
let connectedUsers = [];
const createNewGame = (userId) => {
  const randomNumber = Math.floor(Math.random() * 99) + 9;

  return {
    id: Math.floor(Math.random() * 22) + 9,
    playerOne: { id: userId},
    playerTwo: null,
    value: randomNumber,
    startingNumber: randomNumber,
    // turn: isSingleUser ? user.id : null,
    attemps: [],
    winner: null,
    gameOver:false
  };
};

const joinGame = (state, gameId, user) => {
  return [
    ...state.map((game) => {
      if (game.id === gameId) {
        return { ...game, playerTwo: user, turn: user.id };
      } else {
        return game;
      }
    }),
  ];
};

const calculateValue = (value, number) => {
  const newValue = Math.round((value + number) / 3);
  const isDivisible = (value + number) % 3 === 0;

  return {
    value: newValue,
    isDivisible
  };
};

const findGame = (state, gameId) => {
  return state.find((game) => game.id === gameId);
};

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);
  if (!connectedUsers.includes(socket.id)) {
    connectedUsers.push(socket.id);
  }
  // Join a game/ or create new game
  const startedGame = gamesState.find(
    (game) => game.playerTwo === null && game.winner === null
  );

  console.log('startedGame', startedGame)
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

  // Listen for new turn
  socket.on(NEW_TURN, (data) => {
    console.log('turn data in server', data)
    let existingGame = data.gameData;
    //let previousAttempt = data.gameData.attemps[data.gameData.attemps.length -1]?.newValue

    const newValue = calculateValue(existingGame.value, data.selectedOption);
    let newAttempt = {
      user: socket.id,
      isPlayerOne: socket.id === existingGame.playerOne.id,
      number: data.selectedOption,
      newValue: newValue.value,
      oldValue: existingGame.value,
      text: `[(${data.selectedOption} + ${existingGame.value}) / 3] = ${newValue.value}`,
    }

    existingGame.attemps.push(newAttempt);
    existingGame.value = newValue.value;
    existingGame.winner = newValue.value === 1 ? socket.id : null;
    existingGame.gameOver = existingGame.winner ? true : false
    io.in(existingGame.id).emit(NEW_TURN, existingGame);
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
    const index = connectedUsers.indexOf(socket.id);
    if (index > -1) {
      connectedUsers.splice(index, 1);
    }
    socket.leave(gamesState.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
