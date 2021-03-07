import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_TURN = "turn";
const GAME = "game";
const WON = "won";
const LOST = "lost";
const SOCKET_SERVER_URL = "https://ancient-tundra-88857.herokuapp.com/";
// const SOCKET_SERVER_URL = "http://localhost:4000";
const useGame = (roomId) => {
  const [gameData, setGameData] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on(GAME, (data) => {
      const incomingData = {
        ...data
      };
      setGameData(incomingData);
    });

    socketRef.current.on(WON, (data) => {
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

    socketRef.current.on(LOST, (data) => {
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
      data.attemps.map((item) => {
        item.ownedByCurrentUser = item.user === socketRef.current.id
      })
      const incomingData = {
        ...data
      };
      setGameData(incomingData);
    });


    return () => {
      socketRef.current.disconnect();
    };
  }, []);



  const sendGameData = (selectedOption) => {
      socketRef.current.emit(NEW_TURN, {
        selectedOption: selectedOption,
        gameData: gameData
      });
  };

  return { gameData, sendGameData };
};

export default useGame;
