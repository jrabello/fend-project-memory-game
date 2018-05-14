import { Game } from "./game";

/*
 * I coded everything using typescript, 
 * strong typing ftw :D
 * compile:
 * tsc --outDir ../js -t es2017 --lib "es2017","DOM" app.ts
 */

/**
 * Called when DOM is loaded
 * It's responsible for building necessary data structures and then start the game
 */
function onInit(): void {
    // building card map
    const game = new Game();
    game.start();
}

// Called when DOM is parsed and ready to be modified
document.addEventListener("DOMContentLoaded", (event) => {
    onInit();
});
