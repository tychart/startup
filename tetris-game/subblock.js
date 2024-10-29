export class Subblock {
    constructor(x, y, color, size) {
        // this.id = id;
        this.x = x;           // x position on the grid
        this.y = y;           // y position on the grid
        this.color = color;   // color of the block
        this.size = size;     // size of the block
    }

    // Copy constructor
    copy() {
        return new Subblock(this.x, this.y, this.color, this.size);
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
    move(board, dx, dy) {

        if (
            !this.checkBlockCollision(board, dx, dy) &&
            !this.checkSideCollision(board, dx)
        ) {
            this.x += dx;
            this.y += dy;
            return true;
        }

        return false;
        
    }

    moveExact(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    checkSideCollision(board, dx) {
        let newX = this.x + dx;

        if (newX < 0 || newX >= 10) {
            return true; // out of bounds
        }

        // Check collision with other blocks
        if (
            board[this.y][newX] !== 0 &&
            board[this.y][newX] !== this
        ) {
            return true;
        }
        return false;

    }

    checkBlockCollision(board, dx, dy) {
        let newX = this.x + dx;
        let newY = this.y + dy;
        
        return this.checkBlockCollisionExact(board, newX, newY);
    }

    checkBlockCollisionExact(board, newX, newY) {
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