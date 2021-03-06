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
    
    toggle(): void {
        this.visible = !this.visible;
        this.getHtml().classList.toggle('open');
        this.getHtml().classList.toggle('show');
    }

    getHtml(): HTMLElement {
        return <HTMLElement>document.querySelector('#'+this.getUid());
    }
    getHtmlClass(): string {
        return this.htmlClass;
    }

    addMatchAnimation(){
        this.getHtml().classList.add(`hvr-wobble-vertical`);
        this.getHtml().classList.add('match');
    }
    removeMatchAnimation(arg0: any): any {
        this.getHtml().classList.remove(`hvr-wobble-vertical`);
        this.getHtml().classList.remove(`hvr-wobble-vertical`);
    }

    setVisible(visible: boolean): void {
        this.visible = visible;
    }
    setMatched(matched: boolean): void {
        this.matched = matched;
        this.addMatchAnimation();
    }
    isVisible(): boolean {
        return this.visible;
    }
    isMatched(): boolean {
        return this.matched;
    }

    getUid(): string {
        return this.uid;
    }
    getFkUid(): string {
        return this.uidFkPair;
    }



}