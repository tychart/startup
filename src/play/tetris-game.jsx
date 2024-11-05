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
  const [currentBlock, setCurrentBlock] = useState(new Subblock(2, 5, "red", blockSize));

  let board = [];
  for (let i = 0; i < 20; i++) {
      board[i] = new Array(10).fill(0);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    // draw();

    // Start the game loop
    gameIntervalRef.current = setInterval(gameLoop, gameTick);

    // Cleanup on unmount
    return () => {
      clearInterval(gameIntervalRef.current);
    };
  }, []);

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

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={boardWidth}
        height={boardHeight}
        style={{ backgroundColor: 'grey', border: '5px solid red' }}
      />
      <button onClick={updateBoard}>Start Game</button> {/* Placeholder for game start */}
    </div>
  );
};

export default TetrisGame;
