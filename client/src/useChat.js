import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://localhost:4000";
const startingNumber = 19;
const useChat = (roomId) => {
  const [gameData, setGameData] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
      // setIsGameStarted(true);
      const incomingData = {
        ...data,
        ownedByCurrentUser: data.senderId === socketRef.current.id
      };
      setGameData((data) => [...data, incomingData]);
    });
    console.log('socketref', socketRef);
    console.log('gameData inside listenre', gameData);
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const calculateValue = (value, number) => {
    const newValue =  Math.round((value + number) / 3);
    const isDivisible = (value + number) % 3 === 0;

    return {
      value: newValue,
      isDivisible,
    };
  };

  const sendGameData = (newData) => {
    let gameWinner = null;
    //const randomNumber = Math.floor(Math.random() * 99) + 9;
    const newValue = calculateValue(newData.selectedValue, newData.value ? newData.value : startingNumber);
    if (newValue.value === 1) {
      gameWinner = (newData.senderId === socketRef.current.id) ? 'A WON':'B WON'
    } else if(!newValue.isDivisible) {
      gameWinner = "2"
    }
    console.log('socketref', socketRef);
    console.log('newData', newData);
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      value: newValue.value,
      senderId: socketRef.current.id,
      winner:gameWinner,
      startingNumber:startingNumber,
      isGameStarted:true
      //text: `[(${attempt.number} + ${game.value} / 3)] = ${newValue.value}`,
    });
    
  };

  return {gameData, sendGameData };
};

export default useChat;
