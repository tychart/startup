import { OrangeRicky } from './orange-ricky.js';
import { BlueRicky } from './blue-ricky.js';
import { ClevelandZ } from './cleveland-z.js';
import { RhodeIslandZ } from './rhode-island-z.js';
import { Hero } from './hero.js';
import { Teewee } from './teewee.js';
import { Smashboy } from './smashboy.js';



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gameTick = 1000; // One Second

const width = canvas.width;
const height = canvas.height;

const blockSize = width / 10

let currBlockID = 0;

console.log("test" + blockSize)
const gameBackgroudColor = 'grey'

let board = [];
for (let i = 0; i < 20; i++) {
    board[i] = new Array(10).fill(0);
}

let currentBlock = new Smashboy(5, 3, 'yellow', blockSize);

function onGameTick() {
    let movedBlock = moveBlockDown();
    if (!movedBlock) {
        currentBlock = getRandNewBlockDebug();
        // currentBlock = getRandNewBlock();
    }
    scanBoard();
    updateScreen();
}


// Main Function, called every tick
function updateScreen() {
    clearScreen();
    drawScreen();
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

function moveHorizontal(direction) {
    currentBlock.move(board, direction, 0);
}

function moveBlockDown() {
    return currentBlock.move(board, 0, 1);
}

function fallBlockSoft() {
    moveBlockDown();   
}

function fallBlockHard() {
    while (currentBlock.move(board, 0, 1)) {
    }
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

function getRandNewBlockDebug() {
    return new OrangeRicky(4, 2, 'orange', blockSize);
}


function getRandNewBlock() {
    // Step 1: Generate a random number between 0 and 6 (for 7 possible outcomes)
    const randomChoice = Math.floor(Math.random() * 7);

    // Step 2: Use a switch statement to return a new block based on the random choice
    switch (randomChoice) {
        case 0:
            return new OrangeRicky(4, 2, 'orange', blockSize);
        case 1:
            return new BlueRicky(4, 2, 'blue', blockSize);
        case 2:
            return new ClevelandZ(4, 2, 'red', blockSize);
        case 3:
            return new RhodeIslandZ(4, 2, 'green', blockSize);
        case 4:
            return new Hero(4, 2, 'cyan', blockSize);
        case 5:
            return new Teewee(4, 2, 'purple', blockSize);
        case 6:
            return new Smashboy(4, 2, 'yellow', blockSize);
        default:
            throw new Error("Unexpected choice in getRandNewBlock()");
    }
}



function scanBoard() {

    for (let row = 0; row < board.length; row++) {
        let count = 0;
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] !== 0) {
                 count++;
             }
        }
        if (count === board[row].length) {
            clearRow(row);
        }

        
    }

}

function clearRow(rowIndex) {
    // Step 1: Clear the row at rowIndex
    for (let col = 0; col < board[rowIndex].length; col++) {
        board[rowIndex][col] = 0;
    }
    drawScreen();

    // Step 2: Move all blocks above that row down one row
    for (let row = rowIndex; row > 0; row--) {
        for (let block = 0; block < board[row].length; block++) {
            if (board[row - 1][block] !== 0) {
                board[row - 1][block].moveExact(block, row);
                renderBoard();
                blockingDelay(100);
            }
        }
        board[row] = board[row - 1];

        
        renderBoard();
        blockingDelay(100);

    }

    // Step 3: Zero the top row of the board.
    for (let col = 0; col < board[0].length; col++) {
        board[0][col] = 0;
    }

}

function blockingDelay(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {
        // Do nothing, just loop until the specified time has passed
    }
}


setInterval(onGameTick, gameTick);

document.addEventListener('keydown', (e) => {
    console.log(e.key);
    switch (e.key) {
        case 'ArrowLeft':
            moveHorizontal(-1);
            updateScreen();
            break;
        case 'ArrowRight':
            moveHorizontal(1);
            updateScreen();
            break;
        case 'ArrowUp':
            currentBlock.rotateClockwise(board);
            updateScreen();
            break;
        case 'ArrowDown':
            fallBlockSoft();
            updateScreen();
            break;
        case ' ':
            e.preventDefault();  // Prevent default space behavior
            fallBlockHard();
            updateScreen();
            break;
    }
});