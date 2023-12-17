import { AlgorithmStep } from "../models/algorithm-step.model";
import { AdditionalVariables } from "../models/additional-variables.model";
import { Letter } from "../models/letter.model";



export class AlgorithmStepBuilder {

    step : AlgorithmStep;

    constructor() {
        this.setDefaults();
    }

    public setDefaults() : void {
        this.step = {
            pseudocodeLine : 0,
            lettersInText : [],
            lettersInPattern : [],
            patternOffset : 0,
            textIndex : -1,
            patternIndex : -1,
            command : "",
            additional : new AdditionalVariables(),
            extra : false,
            pseudocodeFilename : ""
        };
    }

    set setPseudocodeLine(pseudocodeLine : number) {
        this.step.pseudocodeLine = pseudocodeLine;
    }

    set setPatternIndex(patternIndex : number) {
        this.step.patternIndex = patternIndex;
    }

    set setTextIndex(textIndex : number) {
        this.step.textIndex = textIndex;
    }

    set setLettersInText(lettersInText : Letter[]) {
        this.step.lettersInText = lettersInText;
    }

    set setLettersInPattern(lettersInPattern : Letter[]) {
        this.step.lettersInPattern = lettersInPattern;
    }

    set setPatternOffset(patternOffset : number) {
        this.step.patternOffset = patternOffset;
    }

    set setCommand(command : string) {
        this.step.command = command;
    }

    set setAdditional(additional : AdditionalVariables) {
        this.step.additional = additional;
    }

    set setExtra(extra : boolean) {
        this.step.extra = extra;
    }

    set setPseudocodeFilename(pseudocodeFilename : string) {
        this.step.pseudocodeFilename = pseudocodeFilename;
    }

    public build() {
        return JSON.parse(JSON.stringify(this.step));
    }
}
