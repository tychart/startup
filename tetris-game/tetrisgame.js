import { Subblock } from './subblock.js';
import { Block  } from './block.js';
import { OrangeRicky } from './orange-ricky.js';
import { BlueRicky } from './blue-ricky.js';
import { ClevelandZ } from './cleveland-z.js';
import { RhodeIslandZ } from './rhode-island-z.js';
// import { Hero } from './hero.js';



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gameTick = 1000; // One Second

const width = canvas.width;
const height = canvas.height;

const blockSize = width / 10

let currBlockID = 0;

// console.log("Start");

// // Delay of 2 seconds (2000 milliseconds)
// setTimeout(() => {
//     console.log("This message appears after 2 seconds.");
// }, 2000);

// console.log("End");


console.log("test" + blockSize)
const gameBackgroudColor = 'grey'

let board = [];
for (let i = 0; i < 20; i++) {
    board[i] = new Array(10).fill(0);
}
// let currentBlock = null;
let currentBlock = new OrangeRicky(5, 3, 'cyan', blockSize);
// let currentBlock = new OrangeRicky(5, 10, 'blue', blockSize);


function onGameTick() {
    let movedBlock = moveBlockDown();
    if (!movedBlock) {
        currentBlock = getRandNewBlock();
    }
    updateScreen();
}


// Main Function, called every tick
function updateScreen() {
    clearScreen();
    drawScreen();
    // clearBlock(currentBlock);
    // drawBlock(currentBlock);
}

function clearScreen() {
    ctx.fillStyle = gameBackgroudColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScreen() {
    currentBlock.draw(ctx);
    renderBoard();
}

function renderBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== 0) {
                board[i][j].draw(ctx);
            }
        }
    }
}

// function generateBlock() {
//     const type = Math.floor(Math.random() * 7);
//     const x = Math.floor(Math.random() * 10);
//     const y = -1;

//     // currentBlock = { type, x, y };
// }

// function drawBlock(block) {
//     ctx.fillStyle = colors[block.type];
//     ctx.fillRect(block.x * width, block.y * height, width, height);
// }

// function clearBlock(block) {
//     ctx.fillStyle = '#000';
//     ctx.fillRect(block.x * width, block.y * height, width, height);
// }

function moveHorizontal(direction) {
    currentBlock.move(board, direction, 0);
}

function moveBlockDown() {
    return currentBlock.move(board, 0, 1);
}

function fallBlock() {
    //temp for testing
    moveBlockDown();   
}



const colors = [
    '#000',
    '#F00',
    '#0F0',
    '#00F',
    '#F0F',
    '#FF0',
    '#0FF'
];

function getRandNewBlock() {
    // Step 1: Generate a random number between 0 and 5 (for 6 possible outcomes)
    const randomChoice = Math.floor(Math.random() * 2);

    // Step 2: Use a switch statement to return a new block based on the random choice
    switch (randomChoice) {
        case 0:
            return new OrangeRicky(5, 5, 'orange', blockSize);
        case 1:
            return new BlueRicky(5, 5, 'blue', blockSize);
        // case 2:
        //     return new ClevelandZ(5, 5, 'red', blockSize);
        // case 3:
        //     return new RhodeIslandZ(5, 5, 'green', blockSize);
        // case 4:
        //     return new Hero(5, 5, 'cyan', blockSize);
        // case 5:
        //     return new Teewee(5, 5, 'purple', blockSize);
        default:
            throw new Error("Unexpected choice in getRandNewBlock()");
    }
}


setInterval(onGameTick, gameTick);

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            console.log('left');
            moveHorizontal(-1);
            updateScreen();
            break;
        case 'ArrowRight':
            console.log('right');
            moveHorizontal(1);
            updateScreen();
            break;
        case 'ArrowUp':
            console.log('down');
            currentBlock.rotateClockwise(board);
            updateScreen();
            break;
        case 'ArrowDown':
            console.log('down');
            fallBlock();
            updateScreen();
            break;
    }
});