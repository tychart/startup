import { Subblock } from './subblock.js';

export class Block {
    constructor(x, y, color, size) {
        // this.id = id;
        this.originX = x;           // x position on the grid
        this.originY = y;           // y position on the grid
        this.color = color;         // color of the block
        this.size = size;           // size of the block
        this.block = [];           // Initialize the block array
        this.positions = [];
        
        this.generateBlock();
        
        
    }

    generateBlock() { // Orange ricky by defaults
        // Populate the block array with Subblock instances
        this.block.push(new Subblock(this.originX - 2, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX - 1, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX + 1, this.originY, this.color, this.size));
    }

    draw(ctx) {
        for (let i = 0; i < this.block.length; i++) {
            this.block[i].draw(ctx);
        }
    }

    move(board, dx, dy) {
        let collision = false;

        // Only evaluates side collisions if moving to the side
        if (dx !== 0) {
            // Don't move, but don't freeze and generate a new block
            if (this.checkBlockSideCollision(board, dx)) {return true;}
        }

        collision = this.checkBlockCollision(board, dx, dy);

        if (collision) {
            this.freezeBlock(board);
            return false;
        }

        // Move the block if no collisions occur
        for (let i = 0; i < this.block.length; i++) {
            this.block[i].move(board, dx, dy);
        }
        return true;
    }

    freezeBlock(board) {
        for (let i = 0; i < this.block.length; i++) {
            this.block[i].freezeSubblock(board);
        }
    }

    checkBlockSideCollision(board, dx, dy) {
        for (let i = 0; i < this.block.length; i++) {
            if (this.block[i].checkSideCollision(board, dx)) {
                return true; // Don't move, but don't freeze and generate a new block
            }
        }
    }

    checkBlockCollision(board, dx, dy) {
        for (let i = 0; i < this.block.length; i++) {
            if (this.block[i].checkBlockCollision(board, dx, dy)) {
                return true;
            }
        }
        return false;
    }
    
    // Method intended to be implemented by subclasses
    rotateClockwise(board) {
        let newBlock = this.copyBlock();
        let successes = [];
    
        successes = this.positions[this.currPos](board, newBlock, successes);

        if (successes.includes(false)) {
            return false;
        }

        this.block = newBlock;
        this.incrimentCurrPos();
        
        return true;
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
    
    // Method intended to be implemented by subclasses
    rotateCounterClockwise() {
        throw new Error("Method 'rotateCounterClockwise()' must be implemented in subclass");
    }


}
