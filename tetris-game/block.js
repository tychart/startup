export class Block {
    constructor(x, y, color, size) {
        this.x = x;           // x position on the grid
        this.y = y;           // y position on the grid
        this.color = color;   // color of the block
        this.size = size;     // size of the block
    }

    // Method to draw the block on the canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * this.size, 
            this.y * this.size, 
            this.size, 
            this.size);
        ctx.strokeStyle = "black"; // outline color
        ctx.strokeRect(
            this.x * this.size, 
            this.y * this.size, 
            this.size, 
            this.size
        );

    }

    // Method to move the block (e.g., move down or to the side)
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    // Optional: Add methods for rotating, changing color, etc.
}