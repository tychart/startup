import { Subblock } from './subblock.js';
import { Block  } from './block.js';

export class OrangeRicky extends Block {
    constructor(x, y, color, size) {
        super(x, y, color, size); // Initializes x, y, color, and size in the Block superclass

        this.block = [];
        this.positions = [];
        this.currPos = 0;

        this.initializePositions();

        this.block.push(new Subblock(this.orginX - 1, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.orginX, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.orginX + 1, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.orginX + 1, this.orginY - 1, this.color, this.size));
    }

    generateBlock() {
        this.block.push(new Subblock(this.orginX - 1, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.orginX, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.orginX + 1, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.orginX + 1, this.orginY - 1, this.color, this.size));
    }


    // rotateClockwise(board) {
    //     let newBlock = this.copyBlock();
    //     let successes = [];
    
    //     successes = this.positions[this.currPos](board, newBlock, successes);

    //     if (successes.includes(false)) {
    //         return false;
    //     }

    //     this.block = newBlock;
    //     this.incrimentCurrPos();
        
    //     return true;
    // }

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

    incrimentCurrPos() {
        if (this.currPos === this.positions.length -1) {
            this.currPos = 0;
        } else {
            this.currPos++;
        }
    }

    copyBlock() {
        let newBlock = [];
        for (let subblock of this.block) {
            newBlock.push(subblock.copy());
        }
        return newBlock;
    }

    checkSuccess(successes) {
        for (let success of successes) {
            if (!success) return false;
        }
    }

    // draw(ctx) {
    //     for (let i = 0; i < this.blocks.length; i++) {
    //         this.blocks[i].draw(ctx);
    //     }
    // }



}