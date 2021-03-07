import React, { useState, useEffect } from "react";

import "./ChatRoom.css";
import useChat from "../useGame";
import bot1 from "../assets/bot1.jpg";
import bot2 from "../assets/bot2.png";
import win_cup from "../assets/win_cup2.gif";
import lose from "../assets/lose.gif";
const ChatRoom = (props) => {
  const { gameData, sendGameData } = useChat('');
  let ownedByCurrentUser = false;
  const handleSendOption = (selectedOption) => {
    sendGameData(selectedOption);
  };

  useEffect(() => {
    var element = document.getElementById('game-container');
    element.scrollTop = element.scrollHeight;
  }, [gameData]);
  if (gameData.attemps && gameData.attemps.length > 0) {
    ownedByCurrentUser = gameData.attemps[gameData.attemps?.length - 1]?.ownedByCurrentUser;
  }

  return (
    <div className="game-room-container">
      <div className="header"> <h3>Game App</h3></div>
      <h3 className="game-name">Starting Number: {gameData.startingNumber}</h3>
      <div id="game-container" className="game-container">
        <ol className="game-data-list">
          {gameData.attemps && gameData.attemps.map((data, i) => (
            <div
              key={i}
              className={`game-item ${data.ownedByCurrentUser ? "my-game" : "received-game"
                }`}
            >
              <div>
                {data.isPlayerOne ?
                  <img src={bot1} alt="Avatar" className="avatar" /> :
                  <img src={bot2} alt="Avatar" className="avatar" />}
              </div>
              <div className={`${data.ownedByCurrentUser ? "my-game-item" : "received-game-item"
                }`}>
                <div className="attempt-number">
                  {data.number}
                </div>

                <div className="attempt-text">
                  {data.text}
                </div>
                <div className="attempt-text">
                  {data.newValue}
                </div>
              </div>
            </div>

          ))}
          {gameData.winner ?
            <>
              <div className="overlay">
                <img src={win_cup} alt="winner" className="game-won-image" />
                <button className="start-newgame-button" onClick={() => window.location.reload()}>New Game</button>
              </div>

            </>
            : null}
          {gameData.looser ?
            <>
              <div className="overlay">
                <img src={lose} alt="looser" className="game-lose-image" />
                <button className="start-newgame-button" onClick={() => window.location.reload()}>New Game</button>
              </div>

            </>
            : null}
        </ol>
      </div>
      <div className="button-container">
        <button disabled={ownedByCurrentUser} onClick={() => handleSendOption(-1)} className={ownedByCurrentUser ? 'send-option-button-disabled' : 'send-option-button'}>
          -1
      </button>
        <button disabled={ownedByCurrentUser} onClick={() => handleSendOption(0)} className={ownedByCurrentUser ? 'send-option-button-disabled' : 'send-option-button'}>
          0
      </button>
        <button disabled={ownedByCurrentUser} onClick={() => handleSendOption(1)} className={ownedByCurrentUser ? 'send-option-button-disabled' : 'send-option-button'}>
          1
      </button>
      </div>
    </div>
  );
};

export default ChatRoom;
