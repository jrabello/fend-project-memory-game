import { Board } from "./board";

export class Game {
    private board: Board;

    constructor() {
        // building card map
        this.board = new Board();
    }
    
    start(): void {
        console.log(`start`);
        this.board.init();
    }

    finish(): void {

    }
    
}