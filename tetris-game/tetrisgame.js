import { Block } from './block.js';


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const blockSize = width / 10

// console.log("Start");

// // Delay of 2 seconds (2000 milliseconds)
// setTimeout(() => {
//     console.log("This message appears after 2 seconds.");
// }, 2000);

// console.log("End");


console.log("test" + blockSize)
const gameBackgroudColor = 'grey'

let board = [];
// let currentBlock = null;
let currentBlock = new Block(9, 19, 'blue', blockSize);
currentBlock.draw(ctx);


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
    
}


function generateBlock() {
    const type = Math.floor(Math.random() * 7);
    const x = Math.floor(Math.random() * 10);
    const y = -1;

    currentBlock = { type, x, y };
}

// function drawBlock(block) {
//     ctx.fillStyle = colors[block.type];
//     ctx.fillRect(block.x * width, block.y * height, width, height);
// }

// function clearBlock(block) {
//     ctx.fillStyle = '#000';
//     ctx.fillRect(block.x * width, block.y * height, width, height);
// }

// function moveBlock(direction) {
//     currentBlock.x += direction;
// }

function fallBlock() {
    currentBlock.y += 1;
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

generateBlock();

setInterval(updateScreen, 100);

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            moveBlock(-1);
            break;
        case 'ArrowRight':
            moveBlock(1);
            break;
        case 'ArrowDown':
            fallBlock();
            break;
    }
});