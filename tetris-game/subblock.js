export class Subblock {
    constructor(id, x, y, color, size) {
        this.id = id;
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

    checkSideCollision(board, dx) {
        let newX = this.x + dx;

        if (newX < 0 || newX >= 10) {
            return true; // out of bounds
        }

        // Check collision with other blocks
        if (board[this.y][newX] != 0) {
            return true;
        }
        return false;

    }

    checkBlockCollision(board, dx, dy) {
        let newX = this.x + dx;
        let newY = this.y + dy;
        
        if (newY >= 20) { // hit the bottom
            return true;
        }

        // Check collision with other blocks
        if (board[newY][newX] != 0) {
            return true;
        }
        return false;
    }

    freezeSubblock(board) {
        board[this.y][this.x] = this;
    }

    // Optional: Add methods for rotating, changing color, etc.
}