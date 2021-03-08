import React from "react";
import "./index.css";

import GameRoom from "./GameRoom/GameRoom";

function App() {
  const [newGame, setNewGame] = React.useState(false);
  return (
    newGame ? <GameRoom /> :
    <div className="home">
      <button className="start-game-button" onClick={() => setNewGame(true)}>
        Start Game
    </button>
    </div>
  );
}

export default App;
