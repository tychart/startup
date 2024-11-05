// TetrisGame.jsx
import React, { useEffect, useRef, useState } from 'react';
import { OrangeRicky } from './classes/orange-ricky';
import { BlueRicky } from './classes/blue-ricky';
import { ClevelandZ } from './classes/cleveland-z';
import { RhodeIslandZ } from './classes/rhode-island-z';
import { Hero } from './classes/hero';
import { Teewee } from './classes/teewee';
import { Smashboy } from './classes/smashboy';

export function TetrisGame() {
  const canvasRef = useRef(null);
  const [gameGoing, setGameGoing] = useState(true);
  const gameTick = 1000;
  const animationSpeed = gameTick / 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const blockSize = width / 10;
    const startingX = 4;
    const startingY = 2;
    const gameBackgroudColor = 'grey';

    let board = Array.from({ length: 20 }, () => new Array(10).fill(0));
    let currentBlock = getRandNewBlock();

    // Game loop
    const interval = setInterval(() => {
      if (gameGoing) {
        onGameTick(ctx);
      }
    }, gameTick);

    function onGameTick() {
      if (!moveBlockDown()) {
        if (currentBlock.originX === startingX && currentBlock.originY === startingY) {
          setGameGoing(false);
          gameOver();
        }
        currentBlock = getRandNewBlock();
      }
      scanBoard();
      updateScreen(ctx);
    }

    function updateScreen(ctx) {
      clearScreen(ctx);
      drawScreen(ctx);
    }

    function clearScreen() {
      ctx.fillStyle = gameBackgroudColor;
      ctx.fillRect(0, 0, width, height);
    }

    function drawScreen(ctx) {
      currentBlock.draw(ctx);
      renderBoard(ctx);
    }

    function renderBoard(ctx) {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] !== 0) {
            board[i][j].draw(ctx);
          }
        }
      }
    }

    function moveBlockDown() {
      return currentBlock.move(board, 0, 1);
    }

    function getRandNewBlock() {
      const randomChoice = Math.floor(Math.random() * 7);
      switch (randomChoice) {
        case 0: return new OrangeRicky(startingX, startingY, 'orange', blockSize);
        case 1: return new BlueRicky(startingX, startingY, 'blue', blockSize);
        case 2: return new ClevelandZ(startingX, startingY, 'red', blockSize);
        case 3: return new RhodeIslandZ(startingX, startingY, 'green', blockSize);
        case 4: return new Hero(startingX, startingY, 'cyan', blockSize);
        case 5: return new Teewee(startingX, startingY, 'purple', blockSize);
        case 6: return new Smashboy(startingX, startingY, 'yellow', blockSize);
        default: throw new Error("Unexpected choice in getRandNewBlock()");
      }
    }

    // Listen for key events
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          currentBlock.move(board, -1, 0);
          updateScreen();
          break;
        case 'ArrowRight':
          currentBlock.move(board, 1, 0);
          updateScreen();
          break;
        case 'ArrowUp':
          currentBlock.rotateClockwise(board);
          updateScreen();
          break;
        case 'ArrowDown':
          moveBlockDown();
          updateScreen();
          break;
        case ' ':
          e.preventDefault();
          while (currentBlock.move(board, 0, 1));
          onGameTick();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameGoing]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="200"
        height="400"
        style={{ backgroundColor: 'white' }}
      />
    </div>
  );
}
