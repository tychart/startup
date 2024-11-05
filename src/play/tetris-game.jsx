import React, { useEffect, useRef, useState } from 'react';
import { Subblock } from './classes/subblock';

export const TetrisGame = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const gameTick = 1000; // One second
  const boardWidth = 300; // Width of the game board
  const boardHeight = 600; // Height of the game board
  const blockSize = 30; // Size of each Tetris block
  const gameIntervalRef = useRef(null); // Ref to store interval ID
  const [board, setBoard] = useState(Array.from({ length: 20 }, () => Array(10).fill(0))); // Board state
  const [currentBlock, setCurrentBlock] = useState(new Subblock(2, 5, "red", blockSize));
  const [gameRunning, setGameRunning] = useState(false); // New state to track if the game is running


  // let board = [];
  // for (let i = 0; i < 20; i++) {
  //     board[i] = new Array(10).fill(0);
  // }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    // draw();

    // Start the game loop only if the game is running
    if (gameRunning) {
      gameIntervalRef.current = setInterval(gameLoop, gameTick);
      window.addEventListener('keydown', handleKeyDown); // Add keydown event listener
    }

    // Cleanup on unmount
    return () => {
      clearInterval(gameIntervalRef.current);
      window.removeEventListener('keydown', handleKeyDown); // Clean up event listener
    };
  }, [gameRunning]); // Depend on gameRunning

  const updateBoard = () => {
    const ctx = contextRef.current; // Access ctx from ref
    ctx.clearRect(0, 0, boardWidth, boardHeight); // Clear the canvas
    currentBlock.draw(ctx);
  };

  const gameLoop = () => {
    console.log('Game tick...'); // Placeholder for game logic
    currentBlock.move(board, 0, 1);
    updateBoard(); // Update the board
  };

  const startGame = () => {
    if (!gameRunning) {
      setCurrentBlock(new Subblock(2, 5, "red", blockSize)); // Reset the block
      setGameRunning(true); // Set game running state to true
      updateBoard(); // Draw the initial state
    }
  };


  const handleKeyDown = (event) => {
    if (!gameRunning) return; // Don't respond if the game isn't running

    switch (event.key) {
      case 'ArrowLeft':
        console.log('Move left');
        currentBlock.move(board, -1, 0); // Move left
        break;
      case 'ArrowRight':
        console.log('Move right');
        currentBlock.move(board, 1, 0); // Move right
        break;
      case 'ArrowDown':
        console.log('Move down');
        currentBlock.move(board, 0, 1); // Move down faster
        break;
      // Add cases for rotating or dropping the block if needed
      default:
        break;
    }
    updateBoard();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={boardWidth}
        height={boardHeight}
        style={{ backgroundColor: 'grey', border: '5px solid red' }}
      />
      <button onClick={startGame}>Start Game</button> {/* Placeholder for game start */}
    </div>
  );
};

export default TetrisGame;
