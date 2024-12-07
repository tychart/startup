const { WebSocketServer } = require('ws');

function webSocketHandler(httpServer, gameManager) {
  // Create a WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    console.log("Got to upgrade")
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  // Keep track of active games and a game ID counter
  const games = [];
  let nextGameID = 1;

  wss.on('connection', (ws) => {
    console.log("Recieved a connection!");
    const connectionId = `player-${Math.floor(Math.random() * 10000)}`;

    // Handle incoming messages
    ws.on('message', (message) => {
      console.log("Recieved a message: ", message);
      const data = JSON.parse(message);

      if (data.type === 'create') {
        // Create a new game
        const newGame = {
          gameID: nextGameID++,
          player1: { id: connectionId, ws: ws },
          player2: null,
        };
        games.push(newGame);
        ws.send(JSON.stringify({ type: 'created', gameId: newGame.gameID, role: 'Player 1' }));

      } else if (data.type === 'join') {
        // Join an existing game
        const game = games.find(game => game.gameID === data.gameId);

        if (game) {
          if (!game.player2) {
            game.player2 = { id: connectionId, ws: ws };
            ws.send(JSON.stringify({ type: 'joined', gameId: game.gameID, role: 'Player 2' }));

            // Notify Player 1 that Player 2 has joined
            if (game.player1?.ws.readyState === ws.OPEN) {
              game.player1.ws.send(JSON.stringify({ type: 'opponentJoined' }));
            }
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
          }
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
        }

      } else if (data.type === 'gameUpdate') {
        // Forward game updates to the opponent
        const game = games.find(game =>
          (game.player1 && game.player1.id === connectionId) ||
          (game.player2 && game.player2.id === connectionId)
        );

        if (game) {
          const opponent = game.player1?.id === connectionId ? game.player2 : game.player1;
          if (opponent && opponent.ws.readyState === ws.OPEN) {
            opponent.ws.send(JSON.stringify({ type: 'gameUpdate', state: data.state }));
          }
        }
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      const gameIndex = games.findIndex(game =>
        (game.player1 && game.player1.id === connectionId) ||
        (game.player2 && game.player2.id === connectionId)
      );

      if (gameIndex >= 0) {
        const game = games[gameIndex];
        if (game.player1?.id === connectionId) {
          game.player1 = null;
        } else if (game.player2?.id === connectionId) {
          game.player2 = null;
        }

        // Remove the game if empty
        if (!game.player1 && !game.player2) {
          games.splice(gameIndex, 1);
        }
      }
    });
  });

  // Keep connections alive
  setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    });
  }, 10000);
}

module.exports = { webSocketHandler };
