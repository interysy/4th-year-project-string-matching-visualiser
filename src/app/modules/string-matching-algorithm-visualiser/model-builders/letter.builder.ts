
import { Letter } from "../models/letter.model";
import { ThemeSelectorService } from "../services/theme-selector.service";


/**
 * @description A builder class used to build the letter object.
 */
export class LetterBuilder {

    /**
     * @description The letter object to build.
     */
    private letter : Letter;

    /**
     * @description The constructor of the LetterBuilder. It takes in the themeSelectorService and sets the letter to have default values.
     * @param themeSelectorService Used for setting colours of characters, as this depends on the theme.
     */
    constructor(private readonly themeSelectorService : ThemeSelectorService) {
        this.setDefaults();
    }

    /**
     * @description A method used to set the letter to have default values. Used upon initialisation of builder or when needing to reset.
     */
    public setDefaults() : void {
        this.letter = {
            index : 0,
            colour : this.themeSelectorService.currentThemeObjectGetter.DEFAULT,
            strokeWeight : 1,
            letter : "",
        };
    }

    /**
     * @description A method used to highlight the entire line of text. It takes in a string and converts to an array of Letters.
     * @param stringToHighlight The string to highlight.
     * @param colour The colour to highlight the string with.
     * @param weight The stroke weight of the string.
     * @returns Letter[] The array of letters highlighted.
     */
    public static highlightEntireLine(stringToHighlight : string , colour : string, weight : number) : Letter[] {
        if (stringToHighlight === undefined || stringToHighlight.length == 0) return [];
        return stringToHighlight.split("").map((char , index) => {
            const letter = new Letter();
            letter.index = index;
            letter.letter = char;
            letter.colour = colour;
            letter.strokeWeight = weight;
            return letter;
        });
    }

    /**
     * @description A method used to replace a letter in the array of letters. Often used when having to recolour.
     * @param toHighlight The array of letters to replace the letter in.
     * @param newLetterDraw The new letter to replace the old letter with.
     */
    public replaceLetter(toHighlight :  Letter[] , newLetterDraw : Letter) : Letter[] {
        const indexToReplace = toHighlight.findIndex(letterDraw => {
            return letterDraw.index === newLetterDraw.index;
        });

        toHighlight[indexToReplace] = newLetterDraw;
        return toHighlight;
    }

    /**
     * @description A method used to set the index of the letter.
     */
    set setIndex(index : number) {
        this.letter.index = index;
    }

    /**
     * @description A method used to set the colour of the letter.
     */
    set setColor(colour : string) {
        this.letter.colour = colour;
    }

    /**
     * @description A method used to set the stroke weight of the letter.
     */
    set setStrokeWeight(strokeWeight : number) {
        this.letter.strokeWeight = strokeWeight;
    }

    /**
     * @description A method used to set the character of the letter.
     */
    set setLetter(letter : string) {
        this.letter.letter = letter;
    }

    /**
     * @description A method used to build the letter object.
     * @returns Letter The letter object built.
     */
    public build() : Letter {
        return JSON.parse(JSON.stringify(this.letter));
    }
}