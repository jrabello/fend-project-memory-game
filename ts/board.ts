import { Card, TCardList } from "./card";
import { constants } from "./constants";
import { Utils } from "./utils";

interface ICardMap {
    [uid: string]: Card;
}

export class Board {
    private matchedCardsCount: number;
    private movesCount: number;
    private waitingAnimationFinish: boolean;
    private starsCount: number;
    private cardsCount: number;
    private cardMap: ICardMap;
    private selectedCards: TCardList;

    constructor() {
        let cards: string[] = [
            'fa-diamond',
            'fa-anchor',
            'fa-bomb',
            'fa-leaf',
            'fa-bolt',
            'fa-bicycle',
            'fa-paper-plane-o',
            'fa-cube',
        ];
        const defaultCard: Card = new Card(
            '',
            '',
            '',
            false,
            false,
        );

        // builds card map
        cards.forEach((card: string) => {

            // this trick allows me to check another card visibility in O(1)
            // by storing a reference to it's pair we can check it very fast using a hashmap :)
            cards.push(card);
            const cardFkUid = card + ((cards.length).toString());

            this.cardMap[card] = new Card(
                card,
                cardFkUid,
                card,
                false,
                false,
            );
            this.cardMap[cardFkUid] = new Card(
                cardFkUid,
                card,
                card,
                false,
                false,
            );
        })
    }

    /**
     * Clears board state
     */
    public init() {
        this.movesCount = 0;
        this.matchedCardsCount = 0;
        this.starsCount = constants.starsLength;

        // put user moves into DOM
        document.querySelector(constants.htmlIds.moves).textContent = this.movesCount.toString();

        // init stars
        const stars = this.getStarsHtml();
        if (stars.length != this.starsCount) {
            // removes stars DOM current 
            const stars = document.querySelector("#stars")
            while (stars.firstChild) {
                stars.removeChild(stars.firstChild);
            }
            // adds stars to DOM
            this.addStars(this.starsCount);
        }

        // sets visible and matched cards to false
        for (const key in this.cardMap) {
            if (this.cardMap.hasOwnProperty(key)) {
                this.cardMap[key].setVisible(false)
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
    public static onClick() {

    }

     /**
     * Builds deck with cards
     * @param cardKeysShuffled 
     */
    private buildDeck(cardKeysShuffled: string[]) {
        // removing deck if any
        const deck = document.querySelector("#deck")
        if (deck) {
            deck.removeEventListener('click', Board.onClick)
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
            i.className = `fa ${this.cardMap[cardKey].getHtmlClass()}`

            li.appendChild(i);
            ul.appendChild(li);
        }

        // inserting deck into DOM
        document.querySelector('#game').appendChild(fragment);
    }

    private removeStar() {
        const firstStar = this.getStarsHtml()[0];
        this.starsCount--;
        document.querySelector('#stars').removeChild(firstStar);
    }
    
    private addStars(count: number): void {
        const stars = document.querySelector("#stars")
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
    
    private getStarsHtml(): NodeListOf<HTMLElement> {
        const starContainer = document.querySelector('#stars');
        const stars = starContainer.getElementsByTagName('li');
        return stars;
    }

}
