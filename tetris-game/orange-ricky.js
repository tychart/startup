import { Subblock } from './subblock.js';
import { Block  } from './block.js';

export class OrangeRicky extends Block {
    constructor(x, y, color, size) {
        super(x, y, color, size); // Initializes x, y, color, and size in the Block superclass

        this.block = [];
        this.positions = [];
        this.currPos = 0;

        this.initializePositions();
        this.generateBlock();
    }

    generateBlock() {
        this.block.push(new Subblock(this.originX - 1, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX + 1, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX + 1, this.originY - 1, this.color, this.size));
    }


    initializePositions() {
        this.positions = [
            (board, newBlock, successes) => { // To Position 1
                successes.push(newBlock[0].move(board, 1, -1));
                successes.push(newBlock[2].move(board, -1, 1));
                successes.push(newBlock[3].move(board, 0, 2));
                return successes;
            }, 
            (board, newBlock, successes) => { // To Position 2
                successes.push(newBlock[0].move(board, 1, 1));
                successes.push(newBlock[2].move(board, -1, -1));
                successes.push(newBlock[3].move(board, -2, 0));
                return successes;
            },
            (board, newBlock, successes) => { // To Position 3
                successes.push(newBlock[0].move(board, -1, 1));
                successes.push(newBlock[2].move(board, 1, -1));
                successes.push(newBlock[3].move(board, 0, -2));
                return successes;
            },
            (board, newBlock, successes) => { // To Position 0
                successes.push(newBlock[0].move(board, -1, -1));
                successes.push(newBlock[2].move(board, 1, 1));
                successes.push(newBlock[3].move(board, 2, 0));
                return successes;
            }
        ]
    }





}