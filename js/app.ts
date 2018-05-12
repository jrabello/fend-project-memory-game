// I coded everything using typescript, 
// strong typing ftw :D
type TICardDescriptorList = ICardDescriptor[];
interface ICardDescriptor {
    uid: string;
    uidFkPair: string;
    visible: boolean;
    matched: boolean;
}

interface ICardMap {
    [uid: string]: ICardDescriptor;
}

interface IBoardDescriptor {
    matchedCards: number;
    cardMap: ICardMap;
}

/*
 * Create a list that holds all of your cards
 */
let cards: string[]  = [
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
    visible: false,
    matched: false,
}
const boardDescriptor: IBoardDescriptor = <IBoardDescriptor>{}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function onInit(): void {
    // build card map
    cards.forEach((card: string) => {

        // this trick allows me to check another card visibility in O(1)
        // by storing a reference to it's pair we can check it fast using a hashmap :)
        cards.push(card);
        const cardFkUid = card+((this.cards.length+1).toString());
        
        boardDescriptor.cardMap[card] = {
            ...defaultCardDescriptor,
            uid: card,
            uidFkPair: cardFkUid,
        };
        boardDescriptor.cardMap[cardFkUid] = {
            ...defaultCardDescriptor,
            uid: cardFkUid,
            uidFkPair: card,
        }
    })

    // once we built the cardMap we can start the game
    startGame();
}

function startGame() {
    console.log(boardDescriptor.cardMap);
    console.log(cards);
    cards = shuffle(cards);
    console.log(cards);
}

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
document.addEventListener("DOMContentLoaded", function(event) {
    onInit();
});
