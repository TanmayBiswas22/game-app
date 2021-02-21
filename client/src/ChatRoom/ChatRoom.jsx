import React from "react";

import "./ChatRoom.css";
import useChat from "../useChat";

const ChatRoom = (props) => {
  const { roomId } = props.match.params;
  const { gameData, sendGameData } = useChat(roomId);
  // const [newMessage, setNewMessage] = React.useState("");
  // const [isGameStarted, setIsGameStarted] = useState(false);
  // const handleNewMessageChange = (event) => {
  //   setNewMessage(event.target.value);
  // };

  const handleSendMessage = (selectedOption) => {
   const newData ={
     selectedValue:selectedOption,
     isGameStarted: true,
     gameID:roomId,
     value:gameData.length > 0 ? gameData[gameData.length-1].value: null
   }
   sendGameData(newData);
    // setNewMessage("");
  };
  console.log('render  data',gameData);
  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      <div className="messages-container">
        <ol className="messages-list">
            {/* Starting Number:{messages[0].startingNumber} */}
          {gameData.map((data, i) => (
            <li
              key={i}
              className={`message-item ${data.ownedByCurrentUser ? "my-message" : "received-message"
                }`}
            >
              
              {data.value}
              {data.value ===1 ? data.senderId + 'WON' : 'player2 loose'}
            </li>
          ))}
        </ol>
      </div>
      <div className="button-container">
        <button onClick={() => handleSendMessage(-1)} className="send-message-button">
          -1
      </button>
        <button onClick={() => handleSendMessage(0)} className="send-message-button">
          0
      </button>
        <button onClick={() => handleSendMessage(1)} className="send-message-button">
          1
      </button>
      </div>

    </div>
  );
};

export default ChatRoom;
