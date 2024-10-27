import { Subblock } from './subblock.js';
import { Block  } from './block.js';

export class OrangeRicky extends Block {
    constructor(x, y, color, size) {
        this.orginX = x;           // x position on the grid
        this.orginY = y;           // y position on the grid
        this.color = color;   // color of the block
        this.size = size;     // size of the block
        let blocks = [];
        blocks.push(new Block(this.orginX - 2, this.orginY, this.color, this.size));
        blocks.push(new Block(this.orginX - 1, this.orginY, this.color, this.size));
        blocks.push(new Block(this.orginX, this.orginY, this.color, this.size));
        blocks.push(new Block(this.orginX + 1, this.orginY, this.color, this.size));
        blocks.push(new Block(this.orginX + 1, this.orginY - 1, this.color, this.size));
    }

    draw(ctx) {
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw(ctx);
        }
    }



}