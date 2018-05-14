export class Card {
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
