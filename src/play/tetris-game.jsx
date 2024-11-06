import React, { useEffect, useRef, useState } from 'react';
import { OrangeRicky } from './classes/orange-ricky.js';
import { BlueRicky } from './classes/blue-ricky.js';
import { ClevelandZ } from './classes/cleveland-z.js';
import { RhodeIslandZ } from './classes/rhode-island-z.js';
import { Hero } from './classes/hero.js';
import { Teewee } from './classes/teewee.js';
import { Smashboy } from './classes/smashboy.js';

export const TetrisGame = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const gameTick = 1000; // One second
  const animationSpeed = gameTick / 50;
  const boardWidth = 300; // Width of the game board
  const boardHeight = 600; // Height of the game board
  const blockSize = 30; // Size of each Tetris block
  const startingX = 4;
  const startingY = 2;

  const gameIntervalRef = useRef(null); // Ref to store interval ID
  const currentBlockRef = useRef(getRandNewBlock());
  const blockLiveTimeRef = useRef(Date.now());

  const [currentBlock, setCurrentBlock] = useState(currentBlockRef.current);
  const [board, setBoard] = useState(Array.from({ length: 20 }, () => Array(10).fill(0))); // Initialize board state
  const [gameRunning, setGameRunning] = useState(false); // New state to track if the game is running

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    // draw();

    // Start the game loop only if the game is running
    if (gameRunning) {
      gameIntervalRef.current = setInterval(onGameTick, gameTick);
      window.addEventListener('keydown', handleKeyDown); // Add keydown event listener
    }

    // Cleanup on unmount
    return () => {
      clearInterval(gameIntervalRef.current);
      window.removeEventListener('keydown', handleKeyDown); // Clean up event listener
    };
  }, [gameRunning]); // Depend on gameRunning

  const onGameTick = () => {
    console.log('Game tick...'); // Placeholder for game logic

    if (gameRunning) {
      fallBlockSoft(); // Move block and check collision
      scanBoard(); // Check for completed lines
      updateCanvas(); 
    }
  };

  // Handle logic for if a collision happens and if game is over
  const fallBlockSoft = () => {

    // Just does a sanity check that the block actualy got a chance to move before it is game over
    const currentTime = Date.now();
    const blockHasExceededTime = currentTime - blockLiveTimeRef.current > gameTick / 2;

    let movedBlock = currentBlockRef.current.move(board, 0, 1);
      if (!movedBlock) {
        if (
          currentBlockRef.current.originX === startingX && 
          currentBlockRef.current.originY === startingY &&
          blockHasExceededTime
        ) {
          setGameRunning(false); // Game over!
          gameOver();
          return false;
        }
        // currentBlockRef.current = getRandNewBlockDebug();
        currentBlockRef.current = getRandNewBlock();
        setCurrentBlock(currentBlockRef.current); // Update React state for rendering purposes only
        blockLiveTimeRef.current = Date.now();
      }
    return true;
  }

  const fallBlockHard = () => {
    while (currentBlockRef.current.move(board, 0, 1)) {}
    onGameTick();
  }

  const scanBoard = async () => {
    let deletedRow = false;

    for (let row = 0; row < board.length; row++) {
      let count = 0;
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] !== 0) {
          count++;
        }
      }
      if (count === board[row].length) {
        await clearRow(row);
        deletedRow = true;
      }
    }

    if (deletedRow) {
      await niceBoardUpdate();
    }
  }

  const clearRow = async (rowIndex) => {
    // Step 1: Clear the row at rowIndex
    for (let col = 0; col < board[rowIndex].length; col++) {
      board[rowIndex][col] = 0;
      updateCanvas();
      await delay(animationSpeed); // This is for the cool disepering blocks animation
    }

    // Step 2: Move every row down one row
    for (let row = rowIndex; row > 0; row--) {
      board[row] = board[row - 1];
    }

    // Step 3: Zero the top row of the board.
    for (let col = 0; col < board[0].length; col++) {
      board[0][col] = 0;
    }

  }

  // Goes through and makes sure the subblock's internal 
  // corridinates match where it is on the board grid
  const niceBoardUpdate = async () => {
    for (let row = board.length - 1; row >= 0; row--) {
      for (let block = 0; block < board[row].length; block++) {
        if (board[row][block] !== 0) {
          board[row][block].moveExact(block, row);
          updateCanvas();
          await delay(animationSpeed);
        }
      }
    }
  }

  // Helper function to create a non-blocking delay
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const updateCanvas = () => {
    const ctx = contextRef.current; // Access ctx from ref
    ctx.clearRect(0, 0, boardWidth, boardHeight); // Clear the canvas
    currentBlockRef.current.draw(ctx);
    drawBoard();
  };

  const drawBoard = () => {
    const ctx = contextRef.current; // Access ctx from ref
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] !== 0) {
            board[i][j].draw(ctx);
        }
      }
    }
  }

  function getRandNewBlock() {
    // Step 1: Generate a random number between 0 and 6 (for 7 possible outcomes)
    const randomChoice = Math.floor(Math.random() * 7);

    // Step 2: Use a switch statement to return a new block based on the random choice
    switch (randomChoice) {
      case 0:
        return new OrangeRicky(startingX, startingY, 'orange', blockSize);
      case 1:
        return new BlueRicky(startingX, startingY, 'blue', blockSize);
      case 2:
        return new ClevelandZ(startingX, startingY, 'red', blockSize);
      case 3:
        return new RhodeIslandZ(startingX, startingY, 'green', blockSize);
      case 4:
        return new Hero(startingX, startingY, 'cyan', blockSize);
      case 5:
        return new Teewee(startingX, startingY, 'purple', blockSize);
      case 6:
        return new Smashboy(startingX, startingY, 'yellow', blockSize);
      default:
        throw new Error("Unexpected choice in getRandNewBlock()");
    }
  }





  

  const startGame = () => {
    if (!gameRunning) {
      // setCurrentBlock(new Subblock(2, 5, "red", blockSize)); // Reset the block
      setGameRunning(true); // Set game running state to true
      updateCanvas();
    }
  };


  const handleKeyDown = (event) => {
    if (!gameRunning) return; // Don't respond if the game isn't running

    switch (event.key) {
      case 'ArrowLeft':
        console.log('Move left');
        currentBlockRef.current.move(board, -1, 0); // Move left
        break;
      case 'ArrowRight':
        console.log('Move right');
        currentBlockRef.current.move(board, 1, 0); // Move right
        break;
      case 'ArrowUp':
        currentBlockRef.current.rotateClockwise(board);
        break;
      case 'ArrowDown':
        console.log('Move down');
        currentBlockRef.current.move(board, 0, 1); // Move down faster
        break;
      case ' ':
        event.preventDefault();  // Prevent default space behavior
        fallBlockHard();
        break;
      default:
        break;
    }
    updateCanvas();
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
