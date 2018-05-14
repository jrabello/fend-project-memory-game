"use strict";
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
exports.__esModule = true;
var game_1 = require("./game");
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
    matchedCardsCount: 0,
    cardsCount: cards.length,
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
        // by storing a reference to it's pair we can check it very fast using a hashmap :)
        cards.push(card);
        var cardFkUid = card + ((cards.length).toString());
        board.cardMap[card] = __assign({}, defaultCardDescriptor, { uid: card, uidFkPair: cardFkUid, "class": card });
        board.cardMap[cardFkUid] = __assign({}, defaultCardDescriptor, { uid: cardFkUid, uidFkPair: card, "class": card });
    });
}
function onPlayAgain() {
    // hide finished-info
    document.querySelector("#game-finish-info").classList.add("hidden");
    // show game
    document.querySelector("#game").classList.remove("hidden");
    restartGame();
}
function onGameFinished() {
    // hide game
    document.querySelector("#game").classList.add("hidden");
    // update game-finished div with information
    document.querySelector("#game-finish-moves").textContent = board.movesCount.toString();
    document.querySelector("#game-finish-stars").textContent = board.starsCount.toString();
    // show finished-info
    document.querySelector("#game-finish-info").classList.remove("hidden");
}
/**
 * Handles game start init
 * TODO: move to class Game
 */
function restartGame() {
    console.log('startGame: ', board.cardMap);
    var start = performance.now();
    // clearing board state
    board.movesCount = 0;
    board.matchedCardsCount = 0;
    document.querySelector('#moves').textContent = board.movesCount.toString();
    var stars = boardGetStarsHtml();
    if (stars.length != 3) {
        // removes from dom current stars
        var stars_1 = document.querySelector("#stars");
        while (stars_1.firstChild) {
            stars_1.removeChild(stars_1.firstChild);
        }
        // adds stars to DOM
        boardAddStars(3);
    }
    board.starsCount = 3;
    // sets visible and matched cards to false
    for (var key in board.cardMap) {
        if (board.cardMap.hasOwnProperty(key)) {
            board.cardMap[key].visible = board.cardMap[key].matched = false;
        }
    }
    // shuffling cards
    var cardKeys = Object.keys(board.cardMap);
    // const cardKeysShuffled = shuffle(cardKeys);
    var cardKeysShuffled = cardKeys;
    // removing deck if any
    var deck = document.querySelector("#deck");
    if (deck) {
        deck.removeEventListener('click', onBoardClicked);
        deck.remove();
    }
    // build deck
    var fragment = document.createDocumentFragment();
    var ul = document.createElement('ul');
    ul.id = ul.className = 'deck';
    ul.addEventListener("click", onBoardClicked);
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
    document.querySelector('#game').appendChild(fragment);
    console.log(performance.now() - start);
}
// Listens for clicks on deck
// and handles clicks on cards via event delegation(to avoid lots of handlers)
function onBoardClicked(event) {
    return __awaiter(this, void 0, void 0, function () {
        var start, currentCard, previousCard, pairCard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = performance.now();
                    currentCard = getSelectedCard(event.target);
                    // console.log('currentCard: ', currentCard);
                    if (!currentCard)
                        return [2 /*return*/];
                    // ignoring some click events if matches some constraints 
                    if (!currentCard ||
                        currentCard.visible ||
                        currentCard.matched ||
                        board.waitingAnimationFinish) {
                        return [2 /*return*/];
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
                    if (boardGetStarsHtml().length == 3 && board.movesCount >= 8 && board.movesCount <= 16) {
                        boardRemoveStar();
                    }
                    else if (boardGetStarsHtml().length == 2 && board.movesCount > 16) {
                        boardRemoveStar();
                    }
                    // only one card was selected, nothing to handle 
                    if (board.selectedCards.length === 1)
                        return [2 /*return*/];
                    previousCard = board.cardMap[board.selectedCards[0].uid];
                    if (!(currentCard.uid == previousCard.uidFkPair)) return [3 /*break*/, 2];
                    pairCard = board.cardMap[previousCard.uid];
                    currentCard.matched = pairCard.matched = true;
                    getHtmlFromCard(currentCard).classList.add('match');
                    getHtmlFromCard(pairCard).classList.add('match');
                    getHtmlFromCard(previousCard).classList.add("hvr-wobble-vertical");
                    getHtmlFromCard(currentCard).classList.add("hvr-wobble-vertical");
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    getHtmlFromCard(previousCard).classList.remove("hvr-wobble-vertical");
                    getHtmlFromCard(currentCard).classList.remove("hvr-wobble-vertical");
                    if (++board.matchedCardsCount === board.cardsCount) {
                        onGameFinished();
                    }
                    return [3 /*break*/, 4];
                case 2:
                    // cards are different :(
                    getHtmlFromCard(previousCard).classList.add("hvr-buzz-out");
                    getHtmlFromCard(currentCard).classList.add("hvr-buzz-out");
                    return [4 /*yield*/, wait()];
                case 3:
                    _a.sent();
                    previousCard.visible = !previousCard.visible;
                    currentCard.visible = !currentCard.visible;
                    getHtmlFromCard(previousCard).classList.remove("hvr-buzz-out");
                    getHtmlFromCard(currentCard).classList.remove("hvr-buzz-out");
                    getHtmlFromCard(previousCard).classList.remove('open');
                    getHtmlFromCard(previousCard).classList.remove('show');
                    getHtmlFromCard(currentCard).classList.remove('open');
                    getHtmlFromCard(currentCard).classList.remove('show');
                    _a.label = 4;
                case 4:
                    //clear selectedCards
                    board.selectedCards.splice(0, board.selectedCards.length);
                    console.log(performance.now() - start);
                    return [2 /*return*/];
            }
        });
    });
}
function boardRemoveStar() {
    var firstStar = boardGetStarsHtml()[0];
    board.starsCount--;
    document.querySelector('#stars').removeChild(firstStar);
}
function boardAddStars(count) {
    var stars = document.querySelector("#stars");
    var fragment = document.createDocumentFragment();
    // adding elements to fragment
    // _ variable is a pattern used to denote the variable won't be used inside loop
    for (var _ = 0; _ < count; _++) {
        var li = document.createElement('li');
        var i = document.createElement('i');
        i.className = "fa fa-star";
        li.appendChild(i);
        fragment.appendChild(li);
    }
    stars.appendChild(fragment);
}
function boardGetStarsHtml() {
    var starContainer = document.querySelector('#stars');
    var stars = starContainer.getElementsByTagName('li');
    return stars;
}
function getHtmlFromCard(card) {
    return document.querySelector('#' + card.uid);
}
function getSelectedCard(element) {
    // ignoring click event
    // when user clicks on deck itself
    var nodeName = element.nodeName.toLowerCase();
    if (nodeName === 'ul') {
        return;
    }
    // if user clicked into i we need to get its parent(li)
    if (nodeName === 'i') {
        element = element.parentElement;
    }
    return board.cardMap[element.id];
}
// utils.collection
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
// utils.time
function delay(seconds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, seconds); })];
        });
    });
}
function wait() {
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
    var game = new game_1.Game();
    game.start();
});
