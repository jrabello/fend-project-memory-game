export class Utils {

    // Helper functions
    // Fisher-Yates (aka Knuth) Shuffle
    // Shuffle function from http://stackoverflow.com/a/2450976
    public static shuffle(array: string[]): string[] {
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

    public static async  delay(seconds: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, seconds));
    }

    public static async wait(): Promise<void> {
        // board.waitingAnimationFinish = true;
        await Utils.delay(1000);
        // board.waitingAnimationFinish = false;
    }

}