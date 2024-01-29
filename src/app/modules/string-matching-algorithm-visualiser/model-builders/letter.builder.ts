
import { Letter } from "../models/letter.model";
import { ThemeSelectorService } from "../services/theme-selector.service";



export class LetterBuilder {

    private letter : Letter;

    constructor(private readonly themeSelectorService : ThemeSelectorService) {
        this.setDefaults();
    }

    public setDefaults() : void {
        this.letter = {
            index : 0,
            colour : this.themeSelectorService.currentThemeObjectGetter.DEFAULT,
            strokeWeight : 1,
            letter : "",
        };
    }

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

    public replaceLetter(toHighlight :  Letter[] , newLetterDraw : Letter) : Letter[] {
        const indexToReplace = toHighlight.findIndex(letterDraw => {
            return letterDraw.index === newLetterDraw.index;
        });

        toHighlight[indexToReplace] = newLetterDraw;
        return toHighlight;
    }

    set setIndex(index : number) {
        this.letter.index = index;
    }

    set setColor(colour : string) {
        this.letter.colour = colour;
    }

    set setStrokeWeight(strokeWeight : number) {
        this.letter.strokeWeight = strokeWeight;
    }

    set setLetter(letter : string) {
        this.letter.letter = letter;
    }

    public build() : Letter {
        return JSON.parse(JSON.stringify(this.letter));
    }
}