import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";

function App() {
  const [newGame, setNewGame] = React.useState(false);
  return (
    newGame ? <ChatRoom /> :
    <div>
      <button className="enter-room-button" onClick={() => setNewGame(true)}>
        Start Game
    </button>
    </div>
  );
}

export default App;
