import React, { useState, useEffect } from 'react';
import { TetrisGame } from './tetris-game';
import { WebSocketManager } from './webSocketManager';

export function Play({ gameId, userName }) {
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [remoteState, setRemoteState] = useState(null);
  const [webSocketManager, setWebSocketManager] = useState(null);

  useEffect(() => {
    // Create a new instance of WebSocketManager and open the connection
    const wsManager = new WebSocketManager(gameId, userName);
    wsManager.connect();

    // Set the WebSocketManager instance to state
    setWebSocketManager(wsManager);

    // Handle incoming game updates
    const handleEvent = (event) => {
      if (event.type === 'gameUpdate') {
        setRemoteState(event.value.state);
      }
    };

    wsManager.addHandler(handleEvent);

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      wsManager.removeHandler(handleEvent);
      wsManager.disconnect();
    };
  }, [gameId, userName]);

  const sendGameUpdate = (localState) => {
    if (webSocketManager) {
      webSocketManager.sendGameUpdate(localState);
    }
  };

  return (
    <main
      className="bg-secondary"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="game-container">
        <div className="local-game">
          <h2>Your Game</h2>
          <TetrisGame userName={userName} onStateChange={sendGameUpdate} />
        </div>
        <div className="remote-game">
          <h2>Opponent's Game</h2>
          {remoteState ? (
            <TetrisGame userName="Opponent" initialState={remoteState} readOnly />
          ) : (
            <p>Waiting for opponent...</p>
          )}
        </div>
      </div>
    </main>
  );
}
