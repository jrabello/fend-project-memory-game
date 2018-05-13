/*
 * I coded everything using typescript, 
 * strong typing ftw :D
 */
type TICardDescriptorList = ICardDescriptor[];
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
    selectedCards: TICardDescriptorList;
    numberOfMatchedCards: number;
    numberOfPairCards: number;
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
const board: IBoardDescriptor = <IBoardDescriptor>{
    cardMap: {},
    selectedCards: [],
    numberOfMatchedCards: 0,
    numberOfPairCards: cards.length,
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
    restartGame();
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

        board.cardMap[card] = {
            ...defaultCardDescriptor,
            uid: card,
            uidFkPair: cardFkUid,
            class: card,
        };
        board.cardMap[cardFkUid] = {
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
function restartGame(): void {
    console.log('startGame: ', board.cardMap);
    const start = performance.now();

    // shuffling cards both O(n)
    const cardKeys = Object.keys(board.cardMap);
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
        li.id = board.cardMap[cardKey].uid;
        i.className = `fa ${board.cardMap[cardKey].class}`

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
async function onDeckClicked(event: MouseEvent): Promise<void> {
    console.log('deck clicked: ', event);

    // here we have li, so we can get it's id since it's unique
    const clickedHtmlElement: HTMLElement = getSelectedHtml(<HTMLElement>event.target);
    if (!clickedHtmlElement)
        return;

    // ignoring some click events if matches some constraints 
    let currentCard: ICardDescriptor = board.cardMap[clickedHtmlElement.id];
    console.log('currentCard: ', currentCard);
    if (
        !currentCard ||
        currentCard.visible ||
        currentCard.matched ||
        board.waitingAnimationFinish
    ) {
        return;
    }

    // changing card state
    currentCard.visible = !currentCard.visible;
    clickedHtmlElement.classList.toggle('open');
    clickedHtmlElement.classList.toggle('show');
    board.selectedCards.push(currentCard);

    // only one card was selected, nothing to handle 
    if (board.selectedCards.length === 1)
        return;
    
    // checking if card pair is equal
    const previousCard = board.cardMap[board.selectedCards[0].uid];
    if (currentCard.uid == previousCard.uidFkPair) {
        // cards are equal!!! :D
        // checking if game finished
        const pairCard = board.cardMap[previousCard.uid];
        currentCard.matched = pairCard.matched = true;
        if (++board.numberOfMatchedCards === board.numberOfPairCards) {
            await sleep();
            restartGame();
        }
    } else {
        // cards are different :(
        await sleep();
        previousCard.visible = !previousCard.visible;
        currentCard.visible = !currentCard.visible;
        document.querySelector('#'+previousCard.uid).classList.remove('open');
        document.querySelector('#'+previousCard.uid).classList.remove('show');
        clickedHtmlElement.classList.remove('open');
        clickedHtmlElement.classList.remove('show');
    }

    //clear selectedCards
    board.selectedCards.splice(0, board.selectedCards.length);
    return;
}

function getSelectedHtml(element: HTMLElement): HTMLElement {

    // ignoring click event in some cases
    // when user clicks on deck itself
    // let clickedHtmlElement: HTMLElement = (<HTMLElement>event.target)
    const nodeName: string = element.nodeName.toLowerCase();
    if (nodeName === 'ul') {
        return;
    }

    // if user clicked into i we need to get its parent(li)
    if (nodeName === 'i') {
        element = element.parentElement;
    }

    return element;
}

async function delay(seconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, seconds));
}
async function sleep(): Promise<void> {
    board.waitingAnimationFinish = true;
    await delay(1000);
    board.waitingAnimationFinish = false;
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
