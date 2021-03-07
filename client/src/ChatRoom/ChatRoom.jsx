import React, { useState , useEffect} from "react";

import "./ChatRoom.css";
import useChat from "../useChat";
import bot1 from "../assets/bot1.png";
import bot2 from "../assets/bot2.png";
import win_cup from "../assets/win_cup.png";
import balloons from "../assets/balloons.png";
const ChatRoom = (props) => {
  //const { roomId } = props.match.params;
  const { gameData, sendGameData } = useChat('');
  const [ isButtonDisabled, setButtonDisabled ] = useState(false);
  useEffect(() => {
    //let lastAttemptByCurrentUser = gameData.attemps && gameData.attemps[gameData.attemps.length -1]?.ownedByCurrentUser ;
    let actionButtons =  document.getElementsByClassName("send-message-button");
    for (let item of actionButtons) {
      item.disabled = gameData.attemps && gameData.attemps[gameData.attemps.length -1]?.ownedByCurrentUser;
  }
    // if(gameData.attemps && gameData.attemps[gameData.attemps.length -1]?.ownedByCurrentUser){
    //   sendGameData([-1,0,1][Math.floor(Math.random() * 3)]);
    // }
  }, [gameData]); // Only re-run the effect if count changes

  const handleSendMessage = (selectedOption) => {
    let actionButtons =  document.getElementsByClassName("send-message-button");
    for (let item of actionButtons) {
      item.disabled = true;
      item.style.backgroundColor = 'Grey';
            
    setTimeout(function(){
      item.disabled = false;
      item.style.backgroundColor = '#31a24c';
      // console.log('gamedata in settimeout',gameData)
    //   if(gameData.attemps && gameData.attemps[gameData.attemps.length -1]?.ownedByCurrentUser){
    //   sendGameData(null,true);
    // }
    // sendGameData(null,true);
    },5000);
  }
    sendGameData(selectedOption);
  };

  // console.log('render  data', gameData);
  return (
    <div className="chat-room-container">
      <h1 className="room-name">Starting Number: {gameData.startingNumber}</h1>
      <div className="messages-container">
        <ol className="messages-list">
          {/* Starting Number:{messages[0].startingNumber} */}
          {gameData.attemps && gameData.attemps.map((data, i) => (
            <div
              key={i}
              className={`message-item ${data.ownedByCurrentUser ? "my-message" : "received-message"
                }`}
            >
              <div>
                {data.isPlayerOne ?
                  <img src={bot1} alt="Avatar" className="avatar" /> :
                  <img src={bot2} alt="Avatar" className="avatar" />}
              </div>
              <div className={`${data.ownedByCurrentUser ? "my-message-item" : "received-message-item"
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
                <img src={win_cup} alt="winner" className="game-end-image" />
                <h2>You Won</h2>
                <button className="start-game-button" onClick={() => window.location.reload()}>New Game</button>
              </div>

            </>
            : null}
          {gameData.looser ?
            <>
              <div className="overlay">
                <img src={balloons} alt="looser" className="game-end-image" />
                <h2>You Lose</h2>
                <button className="start-game-button" onClick={() => window.location.reload()}>New Game</button>
              </div>

            </>
            : null}
        </ol>
      </div>
      <div className="button-container">
        <button  onClick={() => handleSendMessage(-1)} className="send-message-button">
          -1
      </button>
        <button  onClick={() => handleSendMessage(0)} className="send-message-button">
          0
      </button>
        <button  onClick={() => handleSendMessage(1)} className="send-message-button">
          1
      </button>
      </div>
    </div>
  );
};

export default ChatRoom;
