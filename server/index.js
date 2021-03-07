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
        return { ...game, playerTwo: {id:user}, turn: user};
      } else {
        return game;
      }
    }),
  ];
};

const calculateValue = (value, number) => {
  const newValue = Math.floor((value + number) / 3);
  const isDivisible = (value + number) % 3 === 0;

  return {
    value: newValue,
    isDivisible
  };
};

const createGameData = (data,existingGame, newValue,userid) =>{
  console.log('createGameData -->',data);
  console.log('createGameData -->',existingGame);
  console.log('createGameData -->',newValue);
  console.log('createGameData -->',userid);
  let currentGameData = {...existingGame};
  let newAttempt = {
    user: userid,
    isPlayerOne: userid === currentGameData.playerOne.id,
    number: data.selectedOption,
    newValue: newValue.value,
    oldValue: currentGameData.value,
    text: `[(${data.selectedOption} + ${currentGameData.value}) / 3] = ${newValue.value}`,
  }

  currentGameData.attemps.push(newAttempt);
  currentGameData.value = newValue.value;
  currentGameData.winner = newValue.value === 1 ? userid : null;
  currentGameData.gameOver = currentGameData.winner ? true : false
  currentGameData.turn = userid;
  return currentGameData
}
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

  // console.log('startedGame', startedGame)
  if (!startedGame) {
    const game = createNewGame(socket.id);
    gamesState.push(game);
    // console.log('gamesState after creating new game', gamesState)
    socket.join(game.id);
    io.to(game.id).emit("game", game);
  } else {
    gamesState = joinGame(gamesState, startedGame.id, socket.id);
    // console.log('gamesState for alreday create game', gamesState)
    socket.join(startedGame.id);

    io.to(startedGame.id).emit(
      "game",
      findGame(gamesState, startedGame.id)
    );
  }

  // Listen for new turn
  socket.on(NEW_TURN, (data) => {
    // console.log('turn data in server', data)
    let existingGame = data.gameData;
    //let previousAttempt = data.gameData.attemps[data.gameData.attemps.length -1]?.newValue

    const newValue = calculateValue(existingGame.value, data.selectedOption);
    const currentGameData = createGameData(data,existingGame,newValue,socket.id);
    console.log('currentGameData', currentGameData)
    io.in(existingGame.id).emit(NEW_TURN, currentGameData);
    // setTimeout(function(){
    //   console.log('setimeout --->existingGame', existingGame)
    //   console.log('setimeout --->socket.id', socket.id)
    //   if(existingGame.turn === socket.id){
    //     console.log('inside iff of server setimeout');
    //     let existingGame = data.gameData;

    // const newValue = calculateValue(existingGame.value, [-1,0,1][Math.floor(Math.random() * 3)]);
    // console.log('setimeout --->newValue',newValue);
    // const nextTurnUserId = existingGame.playerOne.id === existingGame.turn ? existingGame.playerTwo.id : existingGame.playerOne.id;
    // console.log('setimeout --->nextTurnUserId',nextTurnUserId);
    // const currentGameData = createGameData(data,existingGame,newValue,nextTurnUserId);
    // console.log('setimeout --->currentGameData',currentGameData);
    // io.in(existingGame.id).emit(NEW_TURN, currentGameData);
    // }
    // },5000);
    if (newValue.value === 1) {
      io.to(socket.id).emit("won", existingGame);
     connectedUsers.forEach(userId => {
      if(userId != socket.id){
        io.to(userId).emit("lost", existingGame);
      }
     });
    }

  });

  socket.on("auto_turn", (data) => {
    console.log('auto turn data in server', data)
  });
  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
    const indexOfUser = connectedUsers.indexOf(socket.id);
    if (indexOfUser > -1) {
      connectedUsers.splice(indexOfUser, 1);
    }
    //find game where the discosnnected user is either playerone or playertwo 
    gamesState= gamesState.filter(item => (item.playerOne?.id !== socket.id && item.playerTwo?.id !== socket.id))

    socket.leave(gamesState.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
