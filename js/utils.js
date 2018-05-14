export class Utils {
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
