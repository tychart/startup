const { WebSocketServer } = require('ws');

function webSocketHandler(httpServer, gameManager) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    console.log("Upgrading to WebSocket...");
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    console.log("New WebSocket connection established!");

    let currentPlayer = null;
    let opponentPlayer = null;
    let currentGame = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received message: ", data);

        switch (data.type) {
          case 'join': {
            // console.log("Got to the very top of joinGame")
            const { gameId, userName } = data.value;
            const game = gameManager.getGame(gameId);
            if (!game) {
              ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
              return;
            }

            // console.log("In joinGame");
            // const success = gameManager.addPlayerToGame(gameId, userName);
            // console.log("was adding the new player to the game successful?", success)
            // if (success) {
              currentPlayer = game.getPlayer(game.players.length - 1); // Get newly added player
              currentGame = game;
              currentPlayer.setWebSocketConnection(ws);

              // console.log("Player after setting websocket connection:", currentPlayer)

              ws.send(JSON.stringify({ type: 'joined', gameId: game.id, role: `Player ${game.players.length}` }));
              // console.log("Is the game full?", game.isFull())
              if (game.isFull()) {
                // game.getPlayerByUsername()
                notifyPlayers(game, { type: 'gameStart', message: 'Both players are connected. Let the game begin!' });
              }
            // } else {
            //   ws.send(JSON.stringify({ type: 'error', message: 'Game is full or does not exist' }));
            // }
            break;
          }

          case 'gameUpdate': {
            // console.log("Is truely game update!")
            if (currentGame && currentPlayer) {
              console.log(currentPlayer.userName, currentGame)
              opponentPlayer = currentGame.getOpponentByPlayerUsername(currentPlayer.userName)
              
              // console.log("Opponent player:");
              
              // console.log(opponentPlayer.userName)

              // console.log("data", data)

              // const opponent = currentGame.players.find(p => p !== currentPlayer);
              if (opponentPlayer && opponentPlayer.getWebSocketConnection() && opponentPlayer.getWebSocketConnection().readyState == 1) {
                opponentPlayer.wsConnection.send(JSON.stringify({ type: 'gameUpdate', state: data.value.state }));
              }
            }
            break;
          }

          case 'arbitraryMessage': {
            const { targetPlayerIndex, messageContent } = data;
            if (currentGame && currentGame.players[targetPlayerIndex]) {
              const targetPlayer = currentGame.getPlayer(targetPlayerIndex);
              if (targetPlayer && targetPlayer.wsConnection && targetPlayer.wsConnection.readyState === ws.OPEN) {
                targetPlayer.wsConnection.send(JSON.stringify({ type: 'message', content: messageContent }));
              }
            }
            break;
          }

          case 'gameOver': {
            const { gameId, userName, finalScore } = data.value;
            console.log("Recieved game over event")
            console.log(gameId, userName, finalScore)
          }

          case 'disconnect': {
            const { gameId, userName } = data.value;
            console.log("Disconnecting gameId", gameId, userName);
            gameManager.removePlayerFromGame(gameId, userName);
            console.log(gameManager.toString());
          }

          default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
        }
      } catch (error) {
        console.error("Error processing message: ", error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log("WebSocket connection closed");
      if (currentGame && currentPlayer) {
        gameManager.removePlayerFromGame(currentGame.id, currentPlayer);
        notifyPlayers(currentGame, { type: 'playerDisconnected', message: 'A player has disconnected.' });

        if (currentGame.players.length === 0) {
          gameManager.deleteGame(currentGame.id);
        }
      }
    });
  });

  function notifyPlayers(game, message) {
    // console.log("Trying to notify players", game, message)
    game.players.forEach(player => {
      // console.log("Ready state", player.getWebSocketConnection().readyState)
      if (player.getWebSocketConnection() && player.getWebSocketConnection().readyState == 1) {
        // console.log("trying to send to everyone", message)
        player.getWebSocketConnection().send(JSON.stringify(message));
      }
    });
  }

  setInterval(() => {
    wss.clients.forEach(ws => {
      // console.log("ws ping")
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    });
  }, 10000);
}

module.exports = { webSocketHandler };
