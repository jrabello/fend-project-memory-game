'use strict';
/*
 * I coded everything using typescript,
 * strong typing ftw :D
 */
const constants = {
    htmlIds: {
        moves: '#moves'
    },
    starsLength: 3
};

class Utils {
    // Helper functions
    // Fisher-Yates (aka Knuth) Shuffle
    // Shuffle function from http://stackoverflow.com/a/2450976
    static shuffle(array) {
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
    static async delay(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds));
    }
}

class Card {
    constructor(uid, uidFkPair, htmlClass, visible, matched) {
        this.uid = uid;
        this.uidFkPair = uidFkPair;
        this.htmlClass = htmlClass;
        this.visible = visible;
        this.matched = matched;
    }
    toggle() {
        this.visible = !this.visible;
        this.getHtml().classList.toggle('open');
        this.getHtml().classList.toggle('show');
    }
    getHtml() {
        return document.querySelector('#' + this.getUid());
    }
    getHtmlClass() {
        return this.htmlClass;
    }
    addMatchAnimation() {
        this.getHtml().classList.add(`hvr-wobble-vertical`);
        this.getHtml().classList.add('match');
    }
    removeMatchAnimation(arg0) {
        this.getHtml().classList.remove(`hvr-wobble-vertical`);
        this.getHtml().classList.remove(`hvr-wobble-vertical`);
    }
    setVisible(visible) {
        this.visible = visible;
    }
    setMatched(matched) {
        this.matched = matched;
        if(this.getHtml())
        this.addMatchAnimation();
    }
    isVisible() {
        return this.visible;
    }
    isMatched() {
        return this.matched;
    }
    getUid() {
        return this.uid;
    }
    getFkUid() {
        return this.uidFkPair;
    }
}

class Board {
    constructor(game) {
        this.game = game
        Board.instance = this;
        let cards = [
            'fa-diamond',
            'fa-anchor',
            'fa-bomb',
            'fa-leaf',
            'fa-bolt',
            'fa-bicycle',
            'fa-paper-plane-o',
            'fa-cube',
        ];
        const defaultCard = new Card('', '', '', false, false);
        this.cardMap = {}
        this.cardsCount = cards.length;
        // builds card map
        cards.forEach((card) => {
            // this trick allows me to check another card visibility in O(1)
            // by storing a reference to it's pair we can check it very fast using a hashmap :)
            cards.push(card);
            const cardFkUid = card + ((cards.length).toString());
            this.cardMap[card] = new Card(card, cardFkUid, card, false, false);
            this.cardMap[cardFkUid] = new Card(cardFkUid, card, card, false, false);
        });
    }

    getStarsCount() {
        return this.starsCount;
    }

    getMovesCount() {
        return this.movesCount;
    }

    /**
     * Clears board state
     */
    init() {
        this.movesCount = 0;
        this.matchedCardsCount = 0;
        this.selectedCards = [];
        this.starsCount = constants.starsLength;
        
        // put user moves into DOM
        document.querySelector(constants.htmlIds.moves).textContent = this.movesCount.toString();
        
        // init stars
        const stars = this.getStarsHtml();
        if (stars.length != this.starsCount) {
            // removes stars DOM current 
            const stars = document.querySelector("#stars");
            while (stars.firstChild) {
                stars.removeChild(stars.firstChild);
            }
            // adds stars to DOM
            this.addStars(this.starsCount);
        }

        // sets visible and matched cards to false
        for (const key in this.cardMap) {
            if (this.cardMap.hasOwnProperty(key)) {
                this.cardMap[key].setVisible(false);
                this.cardMap[key].setMatched(false);
            }
        }

        // shuffling cards
        const cardKeys = Object.keys(this.cardMap);
        const cardKeysShuffled = Utils.shuffle(cardKeys);
        // const cardKeysShuffled = cardKeys;

        // building deck with cards
        this.buildDeck(cardKeysShuffled);
    }

    /**
     * Handles user clicks into Board
     */
    static async onClick(event) {
        // filtering clicked html
        let currentCard = Board.instance.getSelectedCard(event.target);
        if (!currentCard)
            return;

        // ignoring some click events if matches some constraints 
        if (!currentCard ||
            currentCard.isVisible() ||
            currentCard.isMatched() ||
            Board.instance.waitingAnimationFinish) {
            return;
        }

        // changing card state
        currentCard.toggle();
        Board.instance.selectedCards.push(currentCard);

        // updating moves
        Board.instance.movesCount++;
        document.querySelector('#moves').textContent = Board.instance.movesCount.toString();
        
        // removing stars from board(if any to remove)
        Board.instance.removeStars();

        // only one card was selected, nothing to handle 
        if (Board.instance.selectedCards.length === 1)
            return;
        
        // checking if card pair is equal
        const previousCard = Board.instance.cardMap[Board.instance.selectedCards[0].getUid()];
        if (currentCard.getUid() == previousCard.getFkUid()) {
            // cards are equal!!! :D
            // checking if game finished
            await Board.instance.handleEqualCards(currentCard, previousCard);
        }
        else {
            // cards are different :(
            // animating different cards
            await Board.instance.handleDifferentCards(currentCard, previousCard);
        }

        // clear selectedCards
        Board.instance.selectedCards.splice(0, Board.instance.selectedCards.length);
        return;
    }

    async handleEqualCards(currentCard, previousCard) {
        // animate equal cards
        const pairCard = Board.instance.cardMap[previousCard.getUid()];
        currentCard.setMatched(true);
        pairCard.setMatched(true);
        await Board.instance.wait();
        currentCard.removeMatchAnimation(true);
        pairCard.removeMatchAnimation(true);
        
        if (++Board.instance.matchedCardsCount === Board.instance.cardsCount) {
            Board.instance.game.finish();
        }
    }

    async handleDifferentCards(currentCard, previousCard) {
        // animate different cards
        previousCard.getHtml().classList.add(`hvr-buzz-out`);
        currentCard.getHtml().classList.add(`hvr-buzz-out`);
        await Board.instance.wait();
        previousCard.toggle();
        currentCard.toggle();
        previousCard.getHtml().classList.remove(`hvr-buzz-out`);
        currentCard.getHtml().classList.remove(`hvr-buzz-out`);
    }

    /**
    * Builds deck with cards
    * @param cardKeysShuffled
    */
    buildDeck(cardKeysShuffled) {
        // removing deck if any
        const deck = document.querySelector("#deck");
        if (deck) {
            deck.removeEventListener('click', Board.onClick);
            deck.remove();
        }

        // build deck
        const fragment = document.createDocumentFragment();
        const ul = document.createElement('ul');
        ul.id = ul.className = 'deck';
        ul.addEventListener("click", Board.onClick);
        fragment.appendChild(ul);

        // building cards
        for (const cardKey of cardKeysShuffled) {
            const li = document.createElement('li');
            const i = document.createElement('i');
            li.className = `card`;
            li.id = this.cardMap[cardKey].getUid();
            i.className = `fa ${this.cardMap[cardKey].getHtmlClass()}`;
            li.appendChild(i);
            ul.appendChild(li);
        }

        // inserting deck into DOM
        document.querySelector('#game').appendChild(fragment);
    }

    /**
     * Waits for one second
     * @returns wait
     */
    async wait() {
        this.waitingAnimationFinish = true;
        await Utils.delay(1000);
        this.waitingAnimationFinish = false;
    }

    getSelectedCard(element) {
        // ignoring click event
        // when user clicks on deck itself
        const nodeName = element.nodeName.toLowerCase();
        if (nodeName === 'ul') {
            return;
        }
        // if user clicked into i we need to get its parent(li)
        if (nodeName === 'i') {
            element = element.parentElement;
        }
        return this.cardMap[element.id];
    }

    removeStars() {
        if (Board.instance.getStarsHtml().length == 3 && Board.instance.movesCount >= 8 && Board.instance.movesCount <= 16) {
            Board.instance.removeStar();
        }
        else if (Board.instance.getStarsHtml().length == 2 && Board.instance.movesCount > 16) {
            Board.instance.removeStar();
        }
    }
    removeStar() {
        const firstStar = this.getStarsHtml()[0];
        this.starsCount--;
        document.querySelector('#stars').removeChild(firstStar);
    }
    addStars(count) {
        const stars = document.querySelector("#stars");
        const fragment = document.createDocumentFragment();
        // adding elements to fragment
        // _ variable is a pattern used to denote the variable won't be used inside loop
        for (let _ = 0; _ < count; _++) {
            const li = document.createElement('li');
            const i = document.createElement('i');
            i.className = `fa fa-star`;
            li.appendChild(i);
            fragment.appendChild(li);
        }
        stars.appendChild(fragment);
    }
    getStarsHtml() {
        const starContainer = document.querySelector('#stars');
        const stars = starContainer.getElementsByTagName('li');
        return stars;
    }
}

class Score {
    constructor(game) {
        Score.seconds = 0;
        this.timerRef = null;
    }

    init() {
        // update ui and model
        Score.seconds = 0;
        document.querySelector(`#time-played`).textContent = Score.seconds.toString();
        
        // starts timer
        if(this.timerRef)
            this.stop();
        this.timerRef = setInterval(this.onEverySecond, 1000);
    }

    // stops timer
    stop() {
        clearInterval(this.timerRef);
    }

    onEverySecond() {
        // update ui and model
        Score.seconds++;
        document.querySelector(`#time-played`).textContent = Score.seconds.toString();
    }
}

class Game {
    constructor() {
        this.board = new Board(this);
        this.score = new Score(this);
    }

    start() {
        this.board.init();
        this.score.init();
    }

    finish() {
        // hide game
        document.querySelector(`#game`).classList.add(`hidden`);

        // update game-finished div with information
        document.querySelector(`#game-finish-moves`).textContent = this.board.getMovesCount().toString();
        document.querySelector(`#game-finish-stars`).textContent = this.board.getStarsCount().toString();
        
        // show finished-info
        document.querySelector(`#game-finish-info`).classList.remove(`hidden`);
        document.querySelector(`#game-finish-time`).textContent = Score.seconds.toString();

        // canceling timer
        this.score.stop();
    }

    onPlayAgain() {
        // hide finished-info
        document.querySelector(`#game-finish-info`).classList.add(`hidden`);

        // show game
        document.querySelector(`#game`).classList.remove(`hidden`);
        this.start();
    }
}

/**
 * Called when DOM is loaded
 * It's responsible for building necessary data structures and then start the game
 */
function onInit() {
    const game = new Game();
    game.start();

    document.querySelector(`#restart`).addEventListener("click", (event) => {
        game.start();
    });
   
    document.querySelector(`#play-again`).addEventListener("click", (event) => {
        game.onPlayAgain();
    });
}

// Called when DOM is parsed and ready to be modified
document.addEventListener("DOMContentLoaded", (event) => {
    onInit();
});
