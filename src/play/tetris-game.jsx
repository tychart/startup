import React, { useEffect, useRef } from 'react';

export const TetrisGame = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const gameTick = 1000; // One second
  const boardWidth = 300; // Width of the game board
  const boardHeight = 600; // Height of the game board
  const blockSize = 30; // Size of each Tetris block
  const gameIntervalRef = useRef(null); // Ref to store interval ID


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;
    draw();

    // Start the game loop
    gameIntervalRef.current = setInterval(gameLoop, gameTick);

    // Cleanup on unmount
    return () => {
      clearInterval(gameIntervalRef.current);
    };
  }, []);

  const updateBoard = () => {
    // clearScreen();
    // drawScreen();
    draw();
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

  const gameLoop = () => {
    // Here you can implement the logic that needs to run every gameTick
    console.log('Game tick...'); // Placeholder for game logic
    updateBoard(); // Redraw the canvas (or you can add more game logic here)
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
