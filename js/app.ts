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
    cardsCount: number;
    cardMap: ICardMap;
    selectedCards: TICardDescriptorList;
    matchedCardsCount: number;
    movesCount: number;
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
    matchedCardsCount: 0,
    cardsCount: cards.length,
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
 * TODO: move to class Game
 */
function restartGame(): void {
    console.log('startGame: ', board.cardMap);
    const start = performance.now();

    // clearing board state
    board.movesCount = 0;
    board.matchedCardsCount = 0;
    document.querySelector('#moves').textContent = board.movesCount.toString(); 
    for (const key in board.cardMap) {
        if (board.cardMap.hasOwnProperty(key)) {
            board.cardMap[key].visible = board.cardMap[key].matched = false;
        }
    }

    // shuffling cards
    const cardKeys = Object.keys(board.cardMap);
    const cardKeysShuffled = shuffle(cardKeys);

    // removing deck if any
    const deck = document.querySelector("#deck")
    if (deck) {
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

// Listens for clicks on deck
// and handles clicks on cards via event delegation(to avoid lots of handlers)
async function onDeckClicked(event: MouseEvent): Promise<void> {
    console.log('deck clicked: ', event);
    console.log('startGame: ', board.cardMap);
    const start = performance.now();

    // filtering clicked html
    let currentCard: ICardDescriptor = getSelectedCard(<HTMLElement>event.target);
    if (!currentCard)
        return;
    
    // here we have li, so we can get it's id since it's unique
    // let currentCard: ICardDescriptor = board.cardMap[clickedHtmlElement.id];
    console.log('currentCard: ', currentCard);
    
    // ignoring some click events if matches some constraints 
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
    getHtmlFromCard(currentCard).classList.toggle('open');
    getHtmlFromCard(currentCard).classList.toggle('show');
    board.selectedCards.push(currentCard);

    // updating moves
    board.movesCount++;
    document.querySelector('#moves').textContent = board.movesCount.toString();

    // removing stars from board
    if( boardGetStarsHtml().length == 3 && board.movesCount >= 8 && board.movesCount <= 16 ){
        boardRemoveStar();
    } else if ( boardGetStarsHtml().length == 2 && board.movesCount > 16 ){
        boardRemoveStar();
    }

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
        getHtmlFromCard(currentCard).classList.add('match');
        getHtmlFromCard(pairCard).classList.add('match');
        if (++board.matchedCardsCount === board.cardsCount) {
            await sleep();
            restartGame();
        }
    } else {
        // cards are different :(
        await sleep();
        previousCard.visible = !previousCard.visible;
        currentCard.visible = !currentCard.visible;
        getHtmlFromCard(previousCard).classList.remove('open');
        getHtmlFromCard(previousCard).classList.remove('show');
        getHtmlFromCard(currentCard).classList.remove('open');
        getHtmlFromCard(currentCard).classList.remove('show');
    }

    //clear selectedCards
    board.selectedCards.splice(0, board.selectedCards.length);
    console.log(performance.now() - start);
    return;
}

function boardRemoveStar() {
    const firstStar = boardGetStarsHtml()[0];
    document.querySelector('#stars').removeChild(firstStar);
}

function boardGetStarsHtml(): NodeListOf<HTMLElement> {
    const moveContainer = document.querySelector('#stars');
    const stars = moveContainer.getElementsByTagName('li');
    return stars;
}

function getHtmlFromCard(card: ICardDescriptor): HTMLElement {
    return document.querySelector('#'+card.uid);
}

function getSelectedCard(element: HTMLElement): ICardDescriptor {

    // ignoring click event
    // when user clicks on deck itself
    const nodeName: string = element.nodeName.toLowerCase();
    if (nodeName === 'ul') {
        return;
    }

    // if user clicked into i we need to get its parent(li)
    if (nodeName === 'i') {
        element = element.parentElement;
    }

    return board.cardMap[element.id];
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
