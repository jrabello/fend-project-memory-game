import { Game } from "./game";
/*
 * I coded everything using typescript,
 * strong typing ftw :D
 */
/**
 * Called when DOM is loaded
 * It's responsible for building necessary data structures and then start the game
 */
function onInit() {
    // building card map
    const game = new Game();
    game.start();
    // once we built the cardMap we can start the game
    // restartGame();
}
// Called when DOM is parsed and ready to be modified
document.addEventListener("DOMContentLoaded", (event) => {
    onInit();
});
// function onPlayAgain() {
//     // hide finished-info
//     document.querySelector(`#game-finish-info`).classList.add(`hidden`);
//     // show game
//     document.querySelector(`#game`).classList.remove(`hidden`);
//     restartGame();
// }
// function onGameFinished() {
//     // hide game
//     document.querySelector(`#game`).classList.add(`hidden`);
//     // update game-finished div with information
//     document.querySelector(`#game-finish-moves`).textContent = board.movesCount.toString();
//     document.querySelector(`#game-finish-stars`).textContent = board.starsCount.toString();
//     // show finished-info
//     document.querySelector(`#game-finish-info`).classList.remove(`hidden`);
// }
// /**
//  * Handles game start init
//  * TODO: move to class Game
//  */
// function restartGame(): void {
//     // console.log('startGame: ', board.cardMap);
//     // const start = performance.now();
//     // // clearing board state
//     // board.movesCount = 0;
//     // board.matchedCardsCount = 0;
//     // document.querySelector('#moves').textContent = board.movesCount.toString();
//     // const stars = boardGetStarsHtml();
//     // if(stars.length != 3) {
//     //     // removes from dom current stars
//     //     const stars = document.querySelector("#stars")
//     //     while(stars.firstChild) {
//     //         stars.removeChild(stars.firstChild);
//     //     }
//     //     // adds stars to DOM
//     //     boardAddStars(3);
//     // }
//     // board.starsCount = 3;
//     // // sets visible and matched cards to false
//     // for (const key in board.cardMap) {
//     //     if (board.cardMap.hasOwnProperty(key)) {
//     //         board.cardMap[key].visible = board.cardMap[key].matched = false;
//     //     }
//     // }
//     // shuffling cards
//     // const cardKeys = Object.keys(board.cardMap);
//     // // const cardKeysShuffled = shuffle(cardKeys);
//     // const cardKeysShuffled = cardKeys;
//     // // removing deck if any
//     // const deck = document.querySelector("#deck")
//     // if (deck) {
//     //     deck.removeEventListener('click', onBoardClicked)
//     //     deck.remove();
//     // }
//     // // build deck
//     // const fragment = document.createDocumentFragment();
//     // const ul = document.createElement('ul');
//     // ul.id = ul.className = 'deck';
//     // ul.addEventListener("click", onBoardClicked);
//     // fragment.appendChild(ul);
//     // // building cards
//     // for (const cardKey of cardKeysShuffled) {
//     //     const li = document.createElement('li');
//     //     const i = document.createElement('i');
//     //     li.className = `card`;
//     //     li.id = board.cardMap[cardKey].uid;
//     //     i.className = `fa ${board.cardMap[cardKey].class}`
//     //     li.appendChild(i);
//     //     ul.appendChild(li);
//     // }
//     // // inserting deck into DOM
//     // document.querySelector('#game').appendChild(fragment);
//     // console.log(performance.now() - start);
// }
// Listens for clicks on deck
// and handles clicks on cards via event delegation(to avoid lots of handlers)
// async function onBoardClicked(event: MouseEvent): Promise<void> {
//     const start = performance.now();
//     // filtering clicked html
//     let currentCard: ICardDescriptor = getSelectedCard(<HTMLElement>event.target);
//     // console.log('currentCard: ', currentCard);
//     if (!currentCard)
//         return;
//     // ignoring some click events if matches some constraints 
//     if (
//         !currentCard ||
//         currentCard.visible ||
//         currentCard.matched ||
//         board.waitingAnimationFinish
//     ) {
//         return;
//     }
//     // changing card state
//     currentCard.visible = !currentCard.visible;
//     getHtmlFromCard(currentCard).classList.toggle('open');
//     getHtmlFromCard(currentCard).classList.toggle('show');
//     board.selectedCards.push(currentCard);
//     // updating moves
//     board.movesCount++;
//     document.querySelector('#moves').textContent = board.movesCount.toString();
//     // removing stars from board
//     if( boardGetStarsHtml().length == 3 && board.movesCount >= 8 && board.movesCount <= 16 ){
//         boardRemoveStar();
//     } else if ( boardGetStarsHtml().length == 2 && board.movesCount > 16 ){
//         boardRemoveStar();
//     }
//     // only one card was selected, nothing to handle 
//     if (board.selectedCards.length === 1)
//         return;
//     // checking if card pair is equal
//     const previousCard = board.cardMap[board.selectedCards[0].uid];
//     if (currentCard.uid == previousCard.uidFkPair) {
//         // cards are equal!!! :D
//         // checking if game finished
//         const pairCard = board.cardMap[previousCard.uid];
//         currentCard.matched = pairCard.matched = true;
//         getHtmlFromCard(currentCard).classList.add('match');
//         getHtmlFromCard(pairCard).classList.add('match');
//         getHtmlFromCard(previousCard).classList.add(`hvr-wobble-vertical`);
//         getHtmlFromCard(currentCard).classList.add(`hvr-wobble-vertical`);
//         await wait();
//         getHtmlFromCard(previousCard).classList.remove(`hvr-wobble-vertical`);
//         getHtmlFromCard(currentCard).classList.remove(`hvr-wobble-vertical`);
//         if (++board.matchedCardsCount === board.cardsCount) {
//             onGameFinished();
//         }
//     } else {
//         // cards are different :(
//         getHtmlFromCard(previousCard).classList.add(`hvr-buzz-out`);
//         getHtmlFromCard(currentCard).classList.add(`hvr-buzz-out`);
//         await wait();
//         previousCard.visible = !previousCard.visible;
//         currentCard.visible = !currentCard.visible;
//         getHtmlFromCard(previousCard).classList.remove(`hvr-buzz-out`);
//         getHtmlFromCard(currentCard).classList.remove(`hvr-buzz-out`);
//         getHtmlFromCard(previousCard).classList.remove('open');
//         getHtmlFromCard(previousCard).classList.remove('show');
//         getHtmlFromCard(currentCard).classList.remove('open');
//         getHtmlFromCard(currentCard).classList.remove('show');
//     }
//     //clear selectedCards
//     board.selectedCards.splice(0, board.selectedCards.length);
//     console.log(performance.now() - start);
//     return;
// }
// function boardRemoveStar() {
//     const firstStar = boardGetStarsHtml()[0];
//     board.starsCount--;
//     document.querySelector('#stars').removeChild(firstStar);
// }
// function boardAddStars(count: number): void {
//     const stars = document.querySelector("#stars")
//     const fragment = document.createDocumentFragment();
//     // adding elements to fragment
//     // _ variable is a pattern used to denote the variable won't be used inside loop
//     for (let _ = 0; _ < count; _++) {
//         const li = document.createElement('li');
//         const i = document.createElement('i');
//         i.className = `fa fa-star`;
//         li.appendChild(i);
//         fragment.appendChild(li);
//     }
//     stars.appendChild(fragment);
// }
// function boardGetStarsHtml(): NodeListOf<HTMLElement> {
//     const starContainer = document.querySelector('#stars');
//     const stars = starContainer.getElementsByTagName('li');
//     return stars;
// }
// function getHtmlFromCard(card: ICardDescriptor): HTMLElement {
//     return document.querySelector('#'+card.uid);
// }
// function getSelectedCard(element: HTMLElement): ICardDescriptor {
//     // ignoring click event
//     // when user clicks on deck itself
//     const nodeName: string = element.nodeName.toLowerCase();
//     if (nodeName === 'ul') {
//         return;
//     }
//     // if user clicked into i we need to get its parent(li)
//     if (nodeName === 'i') {
//         element = element.parentElement;
//     }
//     return board.cardMap[element.id];
// }
