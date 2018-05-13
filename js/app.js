var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/*
 * Create a list that holds all of your cards
 */
var cards = [
    'fa-diamond',
    'fa-anchor',
    'fa-bomb',
    'fa-leaf',
    'fa-bolt',
    'fa-bicycle',
    'fa-paper-plane-o',
    'fa-cube',
];
var defaultCardDescriptor = {
    uid: '',
    uidFkPair: '',
    "class": '',
    visible: false,
    matched: false
};
var boardDescriptor = {
    cardMap: {},
    matchedCards: 0,
    numberOfCards: cards.length * 2,
    waitingAnimationFinish: false
};
/**
 * Called when DOM is loaded
 * It's responsible for building necessary data structures and then start the game
 */
function onInit() {
    // building card map
    buildCardMap();
    // once we built the cardMap we can start the game
    onStartGame();
}
/**
 * Builds card map to allow faster card pair lookup
 */
function buildCardMap() {
    // builds card map
    cards.forEach(function (card) {
        // this trick allows me to check another card visibility in O(1)
        // by storing a reference to it's pair we can check it fast using a hashmap :)
        cards.push(card);
        var cardFkUid = card + ((cards.length).toString());
        boardDescriptor.cardMap[card] = __assign({}, defaultCardDescriptor, { uid: card, uidFkPair: cardFkUid, "class": card });
        boardDescriptor.cardMap[cardFkUid] = __assign({}, defaultCardDescriptor, { uid: cardFkUid, uidFkPair: card, "class": card });
    });
}
/**
 * Handles game start init
 */
function onStartGame() {
    console.log('startGame: ', boardDescriptor.cardMap);
    var start = performance.now();
    // shuffling cards both O(n)
    var cardKeys = Object.keys(boardDescriptor.cardMap);
    var cardKeysShuffled = shuffle(cardKeys);
    // removing deck if any
    var deck = document.querySelector("#deck");
    if (!!deck) {
        deck.removeEventListener('click', onDeckClicked);
        deck.remove();
    }
    // build deck
    var fragment = document.createDocumentFragment();
    var ul = document.createElement('ul');
    ul.id = ul.className = 'deck';
    ul.addEventListener("click", onDeckClicked);
    fragment.appendChild(ul);
    // building cards
    for (var _i = 0, cardKeysShuffled_1 = cardKeysShuffled; _i < cardKeysShuffled_1.length; _i++) {
        var cardKey = cardKeysShuffled_1[_i];
        var li = document.createElement('li');
        var i = document.createElement('i');
        li.className = "card";
        li.id = boardDescriptor.cardMap[cardKey].uid;
        i.className = "fa " + boardDescriptor.cardMap[cardKey]["class"];
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
function onDeckClicked(event) {
    console.log('deck clicked: ', event);
    // ignoring click event in some cases
    // when user clicks on deck itself
    var clickedHtmlElement = event.target;
    var nodeName = clickedHtmlElement.nodeName.toLowerCase();
    if (nodeName === 'ul') {
        return;
    }
    // if user clicked into i we need to get its parent(li)
    if (nodeName === 'i') {
        clickedHtmlElement = clickedHtmlElement.parentElement;
    }
    // here we have li, so we can get it's id since it's unique
    var currentCard = boardDescriptor.cardMap[clickedHtmlElement.id];
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
document.addEventListener("DOMContentLoaded", function (event) {
    onInit();
});
// Helper functions
// Fisher-Yates (aka Knuth) Shuffle
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
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
