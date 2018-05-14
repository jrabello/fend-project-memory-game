import { Board } from "./board";
export class Game {
    constructor() {
        // building card map
        this.board = new Board(this);
    }
    start() {
        console.log(`start`);
        this.board.init();
    }
    finish() {
        console.log(`finish`);
        // hide game
        document.querySelector(`#game`).classList.add(`hidden`);
        // update game-finished div with information
        document.querySelector(`#game-finish-moves`).textContent = this.board.getMovesCount().toString();
        document.querySelector(`#game-finish-stars`).textContent = this.board.getStarsCount().toString();
        // show finished-info
        document.querySelector(`#game-finish-info`).classList.remove(`hidden`);
    }
    onPlayAgain() {
        // hide finished-info
        document.querySelector(`#game-finish-info`).classList.add(`hidden`);
        // show game
        document.querySelector(`#game`).classList.remove(`hidden`);
        this.start();
    }
}
