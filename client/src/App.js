import React from "react";
import "./index.css";

import ChatRoom from "./ChatRoom/ChatRoom";

function App() {
  const [newGame, setNewGame] = React.useState(false);
  return (
    newGame ? <ChatRoom /> :
    <div className="home">
      <button className="start-game-button" onClick={() => setNewGame(true)}>
        Start Game
    </button>
    </div>
  );
}

export default App;
