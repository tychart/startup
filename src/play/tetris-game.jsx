import React, { useEffect, useRef } from 'react';

export const TetrisGame = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const boardWidth = 300; // Width of the game board
  const boardHeight = 600; // Height of the game board
  const blockSize = 30; // Size of each Tetris block

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    draw();
  }, []);

  const updateBoard = () => {
    clearScreen();
    drawScreen();
  };

  const draw = () => {
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, boardWidth, boardHeight); // Clear the canvas

    // // Draw a simple grid for the game board
    // for (let x = 0; x < boardWidth; x += blockSize) {
    //   for (let y = 0; y < boardHeight; y += blockSize) {
    //     context.strokeStyle = '#ddd'; // Grid color
    //     context.strokeRect(x, y, blockSize, blockSize);
    //   }
    // }

    // ctx a sample Tetris block
    ctx.fillStyle = 'blue';
    ctx.fillRect(3 * blockSize, 0, blockSize, blockSize); // Sample block position
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={boardWidth}
        height={boardHeight}
        style={{ backgroundColor: 'grey', border: '5px solid red' }}
      />
      <button onClick={draw}>Start Game</button> {/* Placeholder for game start */}
    </div>
  );
};

export default TetrisGame;
