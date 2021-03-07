import React from "react";
import { Link } from "react-router-dom";
import ChatRoom from "../ChatRoom/ChatRoom";
import "./Home.css";

const Home = () => {
  const [roomName, setRoomName] = React.useState("");
  const [newGame, setNewGame] = React.useState(false);
  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  return (
    <div className="home-container">
      {newGame ? <ChatRoom /> :
        <button className="enter-room-button" onClick={() => setNewGame(true)}>
          Start Game
      </button>}
    </div>
  );
};

export default Home;
