import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_TURN = "turn";
const SOCKET_SERVER_URL = "http://localhost:4000";
const startingNumber = 19;
const useChat = (roomId) => {
  const [gameData, setGameData] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on("game", (data) => {
      // setIsGameStarted(true);
      console.log('incoming data on game start1----?', data);
      const incomingData = {
        ...data
      };
      setGameData(incomingData);
    });

    socketRef.current.on("won", (data) => {
      console.log('game win data ', data);
      data.attemps.map((item) => {
        item.ownedByCurrentUser = item.user === socketRef.current.id
      })

      const incomingData = {
        ...data,
        winner:true,
        looser:false
      };
      setGameData(incomingData);
    });
    socketRef.current.on("lost", (data) => {
      console.log('game lost data ', data);
      data.attemps.map((item) => {
        item.ownedByCurrentUser = item.user === socketRef.current.id
      })

      const incomingData = {
        ...data,
        winner:false,
        looser:true
      };
      setGameData(incomingData);
    });
    socketRef.current.on(NEW_TURN, (data) => {
      console.log('turn  data ', data);
      data.attemps.map((item) => {
        item.ownedByCurrentUser = item.user === socketRef.current.id
      })
      const incomingData = {
        ...data
      };
      console.log('incoming new message', incomingData)
      setGameData(incomingData);
    });

    console.log('socketref', socketRef);
    console.log('gameData inside listenre', gameData);
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);



  const sendGameData = (selectedOption) => {
    socketRef.current.emit(NEW_TURN, {
      selectedOption: selectedOption,
      gameData: gameData
    });
  };

  return { gameData, sendGameData };
};

export default useChat;
