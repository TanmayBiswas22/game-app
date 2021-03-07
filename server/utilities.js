const createNewGame = (userId) => {
    const randomNumber = Math.floor(Math.random() * 99) + 9;
  
    return {
      id:Math.floor(Math.random() * 99) + 9,
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
    let currentGameData = {...existingGame};
    let newAttempt = {
      user: userid,
      isPlayerOne: userid === currentGameData.playerOne?.id,
      number: data.selectedOption,
      newValue: newValue.value,
      oldValue: currentGameData.value,
      text: `[(${data.selectedOption} + ${currentGameData.value}) / 3] = ${newValue.value}`,
    }
  
    currentGameData.attemps?.push(newAttempt);
    currentGameData.value = newValue.value;
    currentGameData.winner = newValue.value === 1 ? userid : null;
    currentGameData.gameOver = currentGameData.winner ? true : false
    currentGameData.turn = userid;
    return currentGameData
  }

  
const findGame = (state, gameId) => {
    return state.find((game) => game.id === gameId);
  };
  module.exports = {
    createNewGame,
    joinGame,
    calculateValue,
    createGameData,
    findGame
  };