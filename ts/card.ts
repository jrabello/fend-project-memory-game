export type TCardList = Card[];
       


export class Card {
    private uid: string;
    private uidFkPair: string;
    private htmlClass: string;
    private visible: boolean;
    private matched: boolean;

    constructor( uid: string, uidFkPair: string, htmlClass: string, visible: boolean, matched: boolean) {
        this.uid = uid;
        this.uidFkPair = uidFkPair;
        this.htmlClass = htmlClass;
        this.visible = visible;
        this.matched = matched;
    }

    setVisible(visible: boolean): void {
        this.visible = visible;
    }

    setMatched(matched: boolean): void {
        this.matched = matched;
    }

    getUid(): string {
        return this.uid;
    }

    getHtmlClass(): string {
        return this.htmlClass;
    }

}