# Two independent units communicating with each other using Socket.IO .

This repository contains the client and server side code for communication between two independent units using socket.io and React CRA  .
- Client  Hosted by Netlify at - https://mygameapp.netlify.app/
- Server Hosted by Heroku at - "https://ancient-tundra-88857.herokuapp.com/"

Live demo: https://mygameapp.netlify.app/


# ## Prerequisites and dependencies

 - React v16+
 - socket.io-client v3+
 - socket.io v3+
  - All the additional dependencies will be installed using the npm install

## How to execute - Server Code

 - Navigate to the server folder and run `npm install` to install the server dependencies. 
    
 - Then execute, `npm start` in a different terminal to start the server. By default server will start at `http://localhost:4000`.

## How to execute - Client Code

 

 - Navigate to the client folder and run `npm install` to install the client dependencies. 
    
 - Then execute, `npm start` to start the application in localhost. By default the app will start at `http://localhost:3000`.
 -  Go to `game-app/main/client/src/useGame.js`  and change the `SOCKET_SERVER_URL` to `http://localhost:4000` (url where server is running).

         


