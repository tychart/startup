import { Subblock } from './subblock.js';

export class Block {
    constructor(id, x, y, color, size) {
        this.id = id;
        this.orginX = x;           // x position on the grid
        this.orginY = y;           // y position on the grid
        this.color = color;         // color of the block
        this.size = size;           // size of the block
        this.block = [];           // Initialize the block array

        // Populate the block array with Subblock instances
        this.block.push(new Subblock(this.id, this.orginX - 1, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.id, this.orginX, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.id, this.orginX + 1, this.orginY, this.color, this.size));
        this.block.push(new Subblock(this.id, this.orginX + 1, this.orginY - 1, this.color, this.size));
    }

    draw(ctx) {
        for (let i = 0; i < this.block.length; i++) {
            this.block[i].draw(ctx);
        }
    }

    move(board, dx, dy) {
        let collision = false;

        // Don't move, but don't freeze and generate a new block
        if (this.checkBlockSideCollision(board, dx)) {return true;} 
        

        collision = this.checkBlockCollision(board, dx, dy);

        if (collision) {
            this.freezeBlock(board)
            return false;
        }

        // Move the block
        for (let i = 0; i < this.block.length; i++) {
            this.block[i].move(dx, dy)
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
}
