import { AlgorithmStep } from "./algorithm-step.model";
import { AlgorithmStepBuilder } from "../model-builders/algorithm-step.builder";
import { LetterBuilder } from "../model-builders/letter.builder";
import { Letter } from "./letter.model";
import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";

export abstract class StringMatchingAlgorithm {

    protected steps : AlgorithmStep[] = [];
    protected textLength : number;
    protected patternLength : number;
    protected previousStep : AlgorithmStep;
    protected text : string;
    protected pattern : string;
    protected algorithmName : string;
    protected readonly algorithmStepBuilder: AlgorithmStepBuilder = new AlgorithmStepBuilder();
    protected readonly letterBuilder : LetterBuilder = new LetterBuilder();


    abstract workOutSteps(text : string , pattern : string) : number;
    protected abstract addSetupSteps(textLength : number , patternLength  : number) : void;

    constructor(algorithmName : string) {
        this.algorithmName = algorithmName;
    }

    protected addStep(algorithmStep : AlgorithmStep) {
        this.steps.push(algorithmStep);
    }

    protected highlightEntireLine(stringToHighlight : string , colour : MatchingAlgorithmColourConstants, weight : number) : Letter[] {
        return stringToHighlight.split("").map((char , index) => {
            const letter = new Letter();
            letter.index = index;
            letter.letter = char;
            letter.colour = colour;
            letter.strokeWeight = weight;
            return letter;
        });
    }

    protected replaceLetter(toHighlight :  Letter[] , newLetterDraw : Letter) : Letter[] {
        toHighlight = toHighlight.filter(letterDraw => {
            return letterDraw.index !== newLetterDraw.index;
        });
        toHighlight.push(newLetterDraw);
        return toHighlight;
    }

    public resetSteps() {
        this.steps = [];
    }

    set textLengthSetter(textLength : number) {
        this.textLength = textLength;
    }

    get textLengthGetter() : number {
        return this.textLength;
    }

    set patternLengthSetter(patternLength : number) {
        this.patternLength = patternLength;
    }

    get patternLengthGetter() : number {
        return this.patternLength;
    }

    get stepsGetter() : AlgorithmStep[] {
        return this.steps;
    }

    get stepsLengthGetter() : number {
        return this.steps.length;
    }

    get algorithmNameGetter() : string {
        return this.algorithmName;
    }
}