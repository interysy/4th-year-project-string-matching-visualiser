
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
            colour : this.themeSelectorService.currentThemeForDrawer.DEFAULT,
            strokeWeight : 1,
            letter : "",
        };
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