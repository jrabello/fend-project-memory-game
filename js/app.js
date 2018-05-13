var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var board = {
    cardMap: {},
    selectedCards: [],
    numberOfMatchedCards: 0,
    numberOfPairCards: cards.length,
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
    restartGame();
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
        board.cardMap[card] = __assign({}, defaultCardDescriptor, { uid: card, uidFkPair: cardFkUid, "class": card });
        board.cardMap[cardFkUid] = __assign({}, defaultCardDescriptor, { uid: cardFkUid, uidFkPair: card, "class": card });
    });
}
/**
 * Handles game start init
 */
function restartGame() {
    console.log('startGame: ', board.cardMap);
    var start = performance.now();
    // shuffling cards both O(n)
    var cardKeys = Object.keys(board.cardMap);
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
        li.id = board.cardMap[cardKey].uid;
        i.className = "fa " + board.cardMap[cardKey]["class"];
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
    return __awaiter(this, void 0, void 0, function () {
        var clickedHtmlElement, currentCard, previousCard, pairCard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('deck clicked: ', event);
                    clickedHtmlElement = getSelectedHtml(event.target);
                    if (!clickedHtmlElement)
                        return [2 /*return*/];
                    currentCard = board.cardMap[clickedHtmlElement.id];
                    console.log('currentCard: ', currentCard);
                    if (!currentCard ||
                        currentCard.visible ||
                        currentCard.matched ||
                        board.waitingAnimationFinish) {
                        return [2 /*return*/];
                    }
                    // changing card state
                    currentCard.visible = !currentCard.visible;
                    clickedHtmlElement.classList.toggle('open');
                    clickedHtmlElement.classList.toggle('show');
                    board.selectedCards.push(currentCard);
                    // only one card was selected, nothing to handle 
                    if (board.selectedCards.length <= 1)
                        return [2 /*return*/];
                    previousCard = board.cardMap[board.selectedCards[0].uid];
                    if (!(currentCard.uid == previousCard.uidFkPair)) return [3 /*break*/, 3];
                    pairCard = board.cardMap[previousCard.uid];
                    currentCard.matched = pairCard.matched = true;
                    if (!(++board.numberOfMatchedCards === board.numberOfPairCards)) return [3 /*break*/, 2];
                    return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    restartGame();
                    _a.label = 2;
                case 2: return [3 /*break*/, 5];
                case 3: 
                // cards are different :(
                return [4 /*yield*/, sleep()];
                case 4:
                    // cards are different :(
                    _a.sent();
                    previousCard.visible = !previousCard.visible;
                    currentCard.visible = !currentCard.visible;
                    document.querySelector('#' + previousCard.uid).classList.remove('open');
                    document.querySelector('#' + previousCard.uid).classList.remove('show');
                    clickedHtmlElement.classList.remove('open');
                    clickedHtmlElement.classList.remove('show');
                    _a.label = 5;
                case 5:
                    //clear selectedCards
                    board.selectedCards.splice(0, board.selectedCards.length);
                    return [2 /*return*/];
            }
        });
    });
}
function getSelectedHtml(element) {
    // ignoring click event in some cases
    // when user clicks on deck itself
    // let clickedHtmlElement: HTMLElement = (<HTMLElement>event.target)
    var nodeName = element.nodeName.toLowerCase();
    if (nodeName === 'ul') {
        return;
    }
    // if user clicked into i we need to get its parent(li)
    if (nodeName === 'i') {
        element = element.parentElement;
    }
    return element;
}
function delay(seconds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, seconds); })];
        });
    });
}
function sleep() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    board.waitingAnimationFinish = true;
                    return [4 /*yield*/, delay(1000)];
                case 1:
                    _a.sent();
                    board.waitingAnimationFinish = false;
                    return [2 /*return*/];
            }
        });
    });
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
