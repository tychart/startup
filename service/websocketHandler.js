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
    let currentGame = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received message: ", data);

        switch (data.type) {
          case 'joinGame': {
            const { gameId, userName } = data.value;
            const game = gameManager.getGame(gameId);
            if (!game) {
              ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
              return;
            }

            const success = gameManager.addPlayerToGame(gameId, userName);
            if (success) {
              currentPlayer = game.getPlayer(game.players.length - 1); // Get newly added player
              currentGame = game;
              currentPlayer.setWebSocketConnection(ws);

              ws.send(JSON.stringify({ type: 'joined', gameId: game.id, role: `Player ${game.players.length}` }));
              if (game.isFull()) {
                notifyPlayers(game, { type: 'gameStart', message: 'Both players are connected. Let the game begin!' });
              }
            } else {
              ws.send(JSON.stringify({ type: 'error', message: 'Game is full or does not exist' }));
            }
            break;
          }

          case 'gameUpdate': {
            if (currentGame && currentPlayer) {
              const opponent = currentGame.players.find(p => p !== currentPlayer);
              if (opponent && opponent.wsConnection && opponent.wsConnection.readyState === ws.OPEN) {
                opponent.wsConnection.send(JSON.stringify({ type: 'gameUpdate', state: data.state }));
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

          case 'disconnect': {
            const { gameId, userName } = data.value;
            console.log("Disconnecting gameId", gameId, userName);
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
    game.players.forEach(player => {
      if (player.wsConnection && player.wsConnection.readyState === WebSocketServer.OPEN) {
        player.wsConnection.send(JSON.stringify(message));
      }
    });
  }

  setInterval(() => {
    wss.clients.forEach(ws => {
      console.log("ws ping")
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    });
  }, 10000);
}

module.exports = { webSocketHandler };
