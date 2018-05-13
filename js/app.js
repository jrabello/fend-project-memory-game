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
    matchedCards: 0,
    cardMap: {}
};
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function onInit() {
    // build card map
    cards.forEach(function (card) {
        // this trick allows me to check another card visibility in O(1)
        // by storing a reference to it's pair we can check it fast using a hashmap :)
        cards.push(card);
        var cardFkUid = card + ((cards.length).toString());
        boardDescriptor.cardMap[card] = __assign({}, defaultCardDescriptor, { uid: card, uidFkPair: cardFkUid, "class": card });
        boardDescriptor.cardMap[cardFkUid] = __assign({}, defaultCardDescriptor, { uid: cardFkUid, uidFkPair: card, "class": card });
    });
    // once we built the cardMap we can start the game
    onStartGame();
}
/**
 * Starts game
 */
function onStartGame() {
    console.log('startGame: ', boardDescriptor.cardMap);
    // shuffling cards
    cards = shuffle(cards);
    // removing cards from deck if any
    var deck = document.querySelector("#deck");
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    // put elements into DOM
    var fragment = document.createDocumentFragment();
    for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
        var card = cards_1[_i];
        var li = document.createElement('li');
        var i = document.createElement('i');
        li.className = "card";
        i.className = "fa " + card;
        li.appendChild(i);
        fragment.appendChild(li);
    }
    deck.appendChild(fragment);
}
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
document.addEventListener("DOMContentLoaded", function (event) {
    onInit();
});
document.querySelector("#restart").addEventListener("click", function (event) {
    onStartGame();
});
