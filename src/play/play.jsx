import React, { useState, useEffect, useRef } from 'react';
import { TetrisGame } from './tetrisGame';
import { WebSocketManager } from './webSocketManager';
import { useParams } from 'react-router-dom';

import './play.css'

export function Play({ userName }) {
  const { gameId } = useParams();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const canvasRef = useRef(null);
  const tetrisGameRef = useRef(null);
  // const [remoteState, setRemoteState] = useState(null);
  const [webSocketManager, setWebSocketManager] = useState(null);
  
  useEffect(() => {
    // Create a new instance of WebSocketManager and open the connection
    const wsManager = new WebSocketManager(gameId, userName);
    wsManager.connect();


    console.log("sent join request ", gameId, userName)
    wsManager.joinGame(gameId, userName);

    // Set the WebSocketManager instance to state
    setWebSocketManager(wsManager);

    // Handle incoming websockets updates
    const webSocketEventHandler = (event) => {
      switch (event.type) {
        case 'gameUpdate':

          console.log('gameUpdate event received!');
          console.log(event)

          if (canvasRef.current && event.state) {
            drawOpponentBoard(event.state);
          }

          break;

        case 'gameStart':
          console.log('Game start event received!');
          if (tetrisGameRef.current) {
            tetrisGameRef.current.startGame(); // Trigger startGame in TetrisGame
          }
          break;

        default:
          break;
      }
    };

    // Add a handler to log all incoming messages
    wsManager.addHandler(webSocketEventHandler);

    // wsManager.addHandler(handleEvent);

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      wsManager.removeHandler(webSocketEventHandler);
      wsManager.disconnectWebSocket();
    };
  }, [gameId, userName]);

  const sendGameUpdate = (localState) => {
    if (webSocketManager) {
      webSocketManager.sendGameUpdate(localState);
    }
  };

  const drawOpponentBoard = (boardString) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const BLOCK_SIZE = 30;
    const BOARD_BLOCK_WIDTH = 10;
    const BOARD_BLOCK_HEIGHT = 20;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const charArray = boardString.split('')
    
    let index = 0;
    for (let i = 0; i < BOARD_BLOCK_HEIGHT; i++) {
      for (let j = 0; j < BOARD_BLOCK_WIDTH; j++) {
      
        if (charArray[index] !== '0') {
          drawBlock(context, j, i, BLOCK_SIZE, parseColor(charArray[index]))
        }
        index++;
      
      }
    }
    
  };

  const drawBlock = (ctx, x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      x * size, 
      y * size, 
      size, 
      size
    );
    ctx.strokeStyle = "black"; // outline color
    ctx.strokeRect(
      x * size, 
      y * size, 
      size, 
      size
    );
  }

  const parseColor = (inChar) => {
    switch (inChar) {
      case 'o':
        return 'orange';
      case 'b':
        return 'blue';
      case 'r':
        return 'red';      
      case 'g':
        return 'green';
      case 'c':
        return 'cyan';
      case 'p':
        return 'purple'; 
      case 'y':
        return 'yellow';
      default:
        return 'blue';
    };
  }

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
          <TetrisGame ref={tetrisGameRef} userName={userName} onStateChange={sendGameUpdate} webSocketManager={webSocketManager} />
        </div>
        <div className="remote-game">
          <h2>Opponent's Game</h2>
          <canvas id="opponentCanvas" ref={canvasRef} width="300" height="600"></canvas>
        </div>
      </div>
    </main>
  );
}
