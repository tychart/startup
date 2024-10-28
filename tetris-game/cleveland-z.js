import { Subblock } from './subblock.js';
import { Block  } from './block.js';

export class ClevelandZ extends Block {
    constructor(x, y, color, size) {
        super(x, y, color, size); // Initializes x, y, color, and size in the Block superclass

        this.block = [];
        this.positions = [];
        this.currPos = 0;

        this.initializePositions();
        this.generateBlock();
    }

    generateBlock() {
        this.block.push(new Subblock(this.orginX - 1, this.orginY - 1, this.color, this.size));
        this.block.push(new Subblock(this.orginX, this.orginY - 1, this.color, this.size));
        this.block.push(new Subblock(this.orginX, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.orginX + 1, this.orginY, this.color, this.size));
    }


    initializePositions() {
        this.positions = [
            (board, newBlock, successes) => { // To Position 1
                successes.push(newBlock[0].move(board, 2, 0));
                successes.push(newBlock[1].move(board, 1, 1));
                successes.push(newBlock[3].move(board, -1, 1));
                return successes;
            }, 
            (board, newBlock, successes) => { // To Position 2
                successes.push(newBlock[0].move(board, 0, 2));
                successes.push(newBlock[1].move(board, -1, 1));
                successes.push(newBlock[3].move(board, -1, -1));
                return successes;
            },
            (board, newBlock, successes) => { // To Position 3
                successes.push(newBlock[0].move(board, -2, 0));
                successes.push(newBlock[1].move(board, -1, -1));
                successes.push(newBlock[3].move(board, 1, -1));
                return successes;
            },
            (board, newBlock, successes) => { // To Position 0
                successes.push(newBlock[0].move(board, 0, -2));
                successes.push(newBlock[1].move(board, 1, -1));
                successes.push(newBlock[3].move(board, 1, 1));
                return successes;
            }
        ]
    }





}