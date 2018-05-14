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
    starsCount: number;
}

export class Game {

    board: IBoardDescriptor;

    constructor() {

    }
    
    start(): void {
console.log(`start`);

    }

    finish(): void {

    }
}