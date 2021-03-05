import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  const [roomName, setRoomName] = React.useState("");

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  return (
    <div className="home-container">
      <Link to={`/newgame`} className="enter-room-button">
        Join room
      </Link>
    </div>
  );
};

export default Home;
