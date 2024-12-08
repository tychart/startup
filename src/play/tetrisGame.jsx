import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { OrangeRicky } from './classes/orange-ricky.js';
import { BlueRicky } from './classes/blue-ricky.js';
import { ClevelandZ } from './classes/cleveland-z.js';
import { RhodeIslandZ } from './classes/rhode-island-z.js';
import { Hero } from './classes/hero.js';
import { Teewee } from './classes/teewee.js';
import { Smashboy } from './classes/smashboy.js';

import './tetris-game.css';



export const TetrisGame = forwardRef((props, ref) => {

  const userName = props.userName;
  const webSocketManager = props.webSocketManager;
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const boardWidth = 300; // Width of the game board
  const boardHeight = 600; // Height of the game board
  const blockSize = 30; // Size of each Tetris block
  const startingX = 4;
  const startingY = 2;

  const gameIntervalRef = useRef(null); // Ref to store interval ID
  const currentBlockRef = useRef(getRandNewBlock());
  const lockDelayRef = useRef(Date.now());
  const gameTickRef = useRef(1000); // One second
  const animationSpeedRef = useRef(gameTickRef.current / 50);
  const boardRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)));

  const [currentBlock, setCurrentBlock] = useState(currentBlockRef.current);
  const [gameRunning, setGameRunning] = useState(false); // New state to track if the game is running
  const [showGameOver, setShowGameOver] = useState(false);

  // Expose methods to the parent component
  useImperativeHandle(ref, () => ({
    startGame,
  }));


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    // draw();

    // Start the game loop only if the game is running
    if (gameRunning) {
      setGameLoop();
      window.addEventListener('keydown', handleKeyDown); // Add keydown event listener
    }

    // Cleanup on unmount
    return () => {
      clearInterval(gameIntervalRef.current);
      window.removeEventListener('keydown', handleKeyDown); // Clean up event listener
    };
  }, [gameRunning]); // Depend on gameRunning

  const onGameTick = () => {
    if (gameRunning) {
      fallBlockSoft(); // Move block and check collision
      scanBoard(); // Check for completed lines
      updateCanvas(); 
      sendScreen();
    }
  };

  // Handle logic for if a collision happens and if game is over
  const fallBlockSoft = () => {

    // Calculates the time for the tetris move reset lock delay 
    // (slide on the floor without freezing)
    const currentTime = Date.now();
    const canLock = currentTime - lockDelayRef.current > gameTickRef.current;

    let movedBlock = currentBlockRef.current.move(boardRef.current, 0, 1, canLock);
      if (!movedBlock) {
        if (
          currentBlockRef.current.originX === startingX && 
          currentBlockRef.current.originY === startingY
        ) {
          setGameRunning(false); // Game over!
          gameOver();
          return false;
        }
        // currentBlockRef.current = getRandNewBlockDebug();
        currentBlockRef.current = getRandNewBlock();
        setCurrentBlock(currentBlockRef.current); // Update React state for rendering purposes only
        speedUpGame();
      }
    return true;
  }

  const fallBlockHard = () => {
    while (currentBlockRef.current.move(boardRef.current, 0, 1, true)) {}

    // Hardcode the time so that the freeze will not happen after fallblockhard is called
    lockDelayRef.current = Date.now() - 10000; 

    onGameTick();
  }

  const scanBoard = async () => {
    let deletedRow = false;

    for (let row = 0; row < boardRef.current.length; row++) {
      let count = 0;
      for (let col = 0; col < boardRef.current[row].length; col++) {
        if (boardRef.current[row][col] !== 0) {
          count++;
        }
      }
      if (count === boardRef.current[row].length) {
        await clearRow(row);
        deletedRow = true;
      }
    }

    if (deletedRow) {
      await niceBoardUpdate();
    }
  }

  const clearRow = async (rowIndex) => {
    // Start the row clearing animation, but don't proceed until it's finished.
    await clearRowAnimation(rowIndex); // Ensure this completes before continuing.

    // Step 2: Move every row down one row
    for (let row = rowIndex; row > 0; row--) {
      boardRef.current[row] = [...boardRef.current[row - 1]]; // Create a new array for the current row
    }

    // Step 3: Zero the top row of the board.
    for (let col = 0; col < boardRef.current[0].length; col++) {
      boardRef.current[0][col] = 0;
    }

  }

  const clearRowAnimation = (rowIndex) => {
    return new Promise((resolve) => {
      // Animation loop for clearing the row
      let col = 0;
      
      const clearNextBlock = () => {
        if (col < boardRef.current[rowIndex].length) {
          boardRef.current[rowIndex][col] = 0; // Clear the block (e.g., fade out or remove)
  
          // Update the canvas for each animation frame
          updateCanvas();
  
          col++;
          setTimeout(clearNextBlock, animationSpeedRef.current); // Continue clearing the next block after a short delay
        } else {
          resolve(); // Once all blocks are cleared, resolve the promise to continue the row shift
        }
      };
      
      // Start the animation
      clearNextBlock();
    });
  };

  // Goes through and makes sure the subblock's internal 
  // corridinates match where it is on the board grid
  const niceBoardUpdate = async () => {
    for (let row = boardRef.current.length - 1; row >= 0; row--) {
      for (let block = 0; block < boardRef.current[row].length; block++) {
        if (boardRef.current[row][block] !== 0) {
          boardRef.current[row][block].moveExact(block, row);
          updateCanvas();
          await delay(animationSpeedRef.current);
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
    for (let i = 0; i < boardRef.current.length; i++) {
      for (let j = 0; j < boardRef.current[i].length; j++) {
        if (boardRef.current[i][j] !== 0) {
          boardRef.current[i][j].draw(ctx);
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



  const speedUpGame = () => {
    gameTickRef.current = gameTickRef.current * 0.98;
    animationSpeedRef.current = gameTickRef.current / 50;
    clearInterval(gameIntervalRef.current);
    setGameLoop();
  }
  
  const setGameLoop = () => {
    gameIntervalRef.current = setInterval(onGameTick, gameTickRef.current);
  }

  const gameOver = () => {
    saveScore(Math.round(gameTickRef.current * 100) / 100);
    setShowGameOver(true); // Show the Game Over popup
  };

  async function saveScore(score) {
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    await fetch('/api/score', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newScore),
    });

    // Let other players know the game has concluded
    webSocketManager.sendGameOver(score);
  }


  // The `GameOverPopup` component
  const GameOverPopup = () => (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h1>Game Over</h1>
        <p>Score: {Math.round(gameTickRef.current * 100) / 100}</p>
        <p>Thanks for playing!</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    </div>
  );
  

  const startGame = () => {
    if (!gameRunning) {
      // setCurrentBlock(new Subblock(2, 5, "red", blockSize)); // Reset the block
      setGameRunning(true); // Set game running state to true
      updateCanvas();
    }
  };

  const resetLockDelay = async () => {
    lockDelayRef.current = Date.now();
  }


  const sendScreen = () => {
    const strArray = new Array(200); // Pre-allocate array for performance
    // sendString = "";
    let index = 0;
    for (let i = 0; i < boardRef.current.length; i++) {
      for (let j = 0; j < boardRef.current[i].length; j++) {
        if (boardRef.current[i][j] == 0) {
          strArray[index++] = 0;
        } else {
          strArray[index++] = boardRef.current[i][j].color[0];
        }
      }
    }

    // Join the array into a string in one operation
    const sendString = strArray.join('');
    // console.log(sendString);
    webSocketManager.sendGameUpdate(sendString);
  }

  const handleKeyDown = (event) => {
    if (!gameRunning) return; // Don't respond if the game isn't running

    switch (event.key) {
      case 'ArrowLeft':
        // console.log('Move left');
        currentBlockRef.current.move(boardRef.current, -1, 0); // Move left
        resetLockDelay();
        break;
      case 'ArrowRight':
        // console.log('Move right');
        currentBlockRef.current.move(boardRef.current, 1, 0); // Move right
        resetLockDelay();
        break;
      case 'ArrowUp':
        currentBlockRef.current.rotateClockwise(boardRef.current);
        resetLockDelay();
        break;
      case 'ArrowDown':
        // console.log('Move down');
        currentBlockRef.current.move(boardRef.current, 0, 1); // Move down faster
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
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={boardWidth}
        height={boardHeight}
        style={{ backgroundColor: 'grey', border: '5px solid red' }}
      />
      {/* <button onClick={startGame}>Start Game</button> */}
      {showGameOver && <GameOverPopup />}
    </div>
  );
});

export default TetrisGame;
