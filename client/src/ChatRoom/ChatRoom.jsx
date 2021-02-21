import React from "react";

import "./ChatRoom.css";
import useChat from "../useChat";

const ChatRoom = (props) => {
  const { roomId } = props.match.params;
  const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = React.useState("");

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    const randomNumber = Math.floor(Math.random() * 99) + 9;
    sendMessage(randomNumber);
    setNewMessage("");
  };

  const createNewGame = () => {
    const randomNumber = Math.floor(Math.random() * 99) + 9;
  
    // return {
    //   id: uuidv4(),
    //   playerOne: user,
    //   playerTwo: isSingleUser ? PLAYER : null,
    //   value: randomNumber,
    //   startingNumber: randomNumber,
    //   turn: isSingleUser ? user.id : null,
    //   attemps: [],
    //   winner: null,
    // };
    //return randomNumber;
  };

  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      <div className="messages-container">
        <ol className="messages-list">
          {messages.map((message, i) => (
            <li
              key={i}
              className={`message-item ${
                message.ownedByCurrentUser ? "my-message" : "received-message"
              }`}
            >
              {message.body}
            </li>
          ))}
        </ol>
      </div>
      {/* <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        className="new-message-input-field"
      /> */}
      {/* {createNewGame()} */}
      <button onClick={handleSendMessage} className="send-message-button">
        Start
      </button>
    </div>
  );
};

export default ChatRoom;
