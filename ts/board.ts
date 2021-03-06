import { Card, TCardList } from "./card";
import { constants } from "./constants";
import { Utils } from "./utils";
import { Game } from "./game";

interface ICardMap {
    [uid: string]: Card;
}
export interface IBoardClient {
    finish(): void;
}

export class Board {
        
private matchedCardsCount: number;
    private movesCount: number;
    private waitingAnimationFinish: boolean;
    private starsCount: number;
    private cardsCount: number;
    private cardMap: ICardMap;
    private selectedCards: TCardList;
    private game: Game;
    private static instance: Board;

    constructor(game: Game) {
        this.game = game;
        Board.instance = this;
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

    getStarsCount(): any {
        return this.starsCount;
    }
    getMovesCount(): any {
        return this.movesCount;
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
    public static async onClick(event: MouseEvent): Promise<void> {
        const start = performance.now();

        // filtering clicked html
        let currentCard: Card = Board.instance.getSelectedCard(<HTMLElement>event.target);
        if (!currentCard)
            return;
        
        // ignoring some click events if matches some constraints 
        if (
            !currentCard ||
            currentCard.isVisible() ||
            currentCard.isMatched() ||
            Board.instance.waitingAnimationFinish
        ) {
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
        } else {
            // cards are different :(
            // animating different cards
            await Board.instance.handleDifferentCards(currentCard, previousCard);
        }

        // clear selectedCards
        Board.instance.selectedCards.splice(0, Board.instance.selectedCards.length);
        console.log(performance.now() - start);
        return;
    }

    private async handleEqualCards(currentCard: Card, previousCard: Card): Promise<void>{
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

    private async handleDifferentCards(currentCard: Card, previousCard: Card): Promise<void>{
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
    
    /**
     * Waits board for one second
     * @returns wait 
     */
    private async wait(): Promise<void> {
        this.waitingAnimationFinish = true;
        await Utils.delay(1000);
        this.waitingAnimationFinish = false;
    }

    private getSelectedCard(element: HTMLElement): Card {
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
    
        return this.cardMap[element.id];
    }

    private removeStars(){
        if( Board.instance.getStarsHtml().length == 3 && Board.instance.movesCount >= 8 && Board.instance.movesCount <= 16 ){
            Board.instance.removeStar();
        } else if ( Board.instance.getStarsHtml().length == 2 && Board.instance.movesCount > 16 ){
            Board.instance.removeStar();
        }
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
