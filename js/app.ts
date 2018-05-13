/*
 * I coded everything using typescript, 
 * strong typing ftw :D
 */
interface ICardDescriptor {
    uid: string;
    uidFkPair: string;
    class: string;
    visible: boolean;
    matched: boolean;
}

interface ICardMap {
    [uid: string]: ICardDescriptor;
}

interface IBoardDescriptor {
    cardMap: ICardMap;
    matchedCards: number;
    numberOfCards: number;
    waitingAnimationFinish: boolean;
}

/*
 * Create a list that holds all of your cards
 */
let cards: string[] = [
    'fa-diamond',
    'fa-anchor',
    'fa-bomb',
    'fa-leaf',
    'fa-bolt',
    'fa-bicycle',
    'fa-paper-plane-o',
    'fa-cube',
]
const defaultCardDescriptor: ICardDescriptor = {
    uid: '',
    uidFkPair: '',
    class: '',
    visible: false,
    matched: false,
}
const boardDescriptor: IBoardDescriptor = <IBoardDescriptor>{
    cardMap: {},
    matchedCards: 0,
    numberOfCards: cards.length * 2,
    waitingAnimationFinish: false,
}


/**
 * Called when DOM is loaded
 * It's responsible for building necessary data structures and then start the game
 */
function onInit(): void {
    // building card map
    buildCardMap();

    // once we built the cardMap we can start the game
    onStartGame();
}

/**
 * Builds card map to allow faster card pair lookup
 */
function buildCardMap(): void {
    // builds card map
    cards.forEach((card: string) => {

        // this trick allows me to check another card visibility in O(1)
        // by storing a reference to it's pair we can check it fast using a hashmap :)
        cards.push(card);
        const cardFkUid = card + ((cards.length).toString());

        boardDescriptor.cardMap[card] = {
            ...defaultCardDescriptor,
            uid: card,
            uidFkPair: cardFkUid,
            class: card,
        };
        boardDescriptor.cardMap[cardFkUid] = {
            ...defaultCardDescriptor,
            uid: cardFkUid,
            uidFkPair: card,
            class: card,
        }
    })
}

/**
 * Handles game start init
 */
function onStartGame(): void {
    console.log('startGame: ', boardDescriptor.cardMap);
    const start = performance.now();

    // shuffling cards both O(n)
    const cardKeys = Object.keys(boardDescriptor.cardMap);
    const cardKeysShuffled = shuffle(cardKeys);

    // removing deck if any
    const deck = document.querySelector("#deck")
    if (!!deck) {
        deck.removeEventListener('click', onDeckClicked)
        deck.remove();
    }

    // build deck
    const fragment = document.createDocumentFragment();
    const ul = document.createElement('ul');
    ul.id = ul.className = 'deck';
    ul.addEventListener("click", onDeckClicked);
    fragment.appendChild(ul);

    // building cards
    for (const cardKey of cardKeysShuffled) {
        const li = document.createElement('li');
        const i = document.createElement('i');

        li.className = `card`;
        li.id = boardDescriptor.cardMap[cardKey].uid;
        i.className = `fa ${boardDescriptor.cardMap[cardKey].class}`

        li.appendChild(i);
        ul.appendChild(li);
    }

    // inserting deck into DOM
    document.querySelector('#container').appendChild(fragment);
    console.log(performance.now() - start);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Listens for clicks on deck
// and handles clicks on cards via event delegation(to avoid lots of handlers)
function onDeckClicked(event: MouseEvent): void {
    console.log('deck clicked: ', event);
    
    // ignoring click event in some cases
    // when user clicks on deck itself
    let clickedHtmlElement: HTMLElement = (<HTMLElement>event.target)
    const nodeName: string = clickedHtmlElement.nodeName.toLowerCase();
    if (nodeName === 'ul') {
        return;
    }
    
    // if user clicked into i we need to get its parent(li)
    if (nodeName === 'i') {
        clickedHtmlElement = clickedHtmlElement.parentElement;
    }
    
    // here we have li, so we can get it's id since it's unique
    let currentCard: ICardDescriptor = boardDescriptor.cardMap[clickedHtmlElement.id];
    
    // ignoring some click events if matches some constraints 
    if (currentCard.matched) {
        return;
    }
    
    // changing card state
    currentCard.visible = !currentCard.visible;
    clickedHtmlElement.classList.toggle('open');
    clickedHtmlElement.classList.toggle('show');
}

// Called when DOM is parsed and ready to be modified
document.addEventListener("DOMContentLoaded", (event) => {
    onInit();
});

// Helper functions
// Fisher-Yates (aka Knuth) Shuffle
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array: string[]): string[] {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
