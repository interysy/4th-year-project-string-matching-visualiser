import { AlgorithmStep } from "./algorithm-step.model";
import { AlgorithmStepBuilder } from "../model-builders/algorithm-step.builder";
import { LetterBuilder } from "../model-builders/letter.builder";
import { Letter } from "./letter.model";
import * as p5 from "p5";
import { StringMatchingAlgorithmToDraw } from "../drawers/algorithm-draw.model";
import { Injector } from "@angular/core";
import { P5jsDrawClass } from "../drawers/p5js.drawer";
import { ThemeSelectorService } from "../services/theme-selector.service";

export abstract class StringMatchingAlgorithm implements StringMatchingAlgorithmToDraw {

    protected steps : AlgorithmStep[] = [];
    protected textLength : number;
    protected patternLength : number;
    protected previousStep : AlgorithmStep;
    protected text : string;
    protected pattern : string;
    protected algorithmName : string;
    protected readonly algorithmStepBuilder: AlgorithmStepBuilder = new AlgorithmStepBuilder();
    protected readonly letterBuilder : LetterBuilder;
    p5jsDrawService : P5jsDrawClass;

    protected preProcessingCanvas : boolean;
    protected preProcessingFunction : string;
    themeSelectorService: ThemeSelectorService;

    abstract workOutSteps(text : string , pattern : string) : number;
    protected abstract addSetupSteps(textLength : number , patternLength  : number) : void;

    constructor() {
         this.p5jsDrawService = Injector.create({providers: [{provide: P5jsDrawClass, deps: []}]}).get(P5jsDrawClass);
         this.themeSelectorService = Injector.create({providers: [{provide: ThemeSelectorService, deps: []}]}).get(ThemeSelectorService);
         this.letterBuilder = new LetterBuilder(this.themeSelectorService);
    }

    draw(obj : P5jsDrawClass) : void {
        console.log("layer 1");
    }

    protected addStep(algorithmStep : AlgorithmStep) {
        this.steps.push(algorithmStep);
    }

    protected highlightEntireLine(stringToHighlight : string , colour : string, weight : number) : Letter[] {
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
        const indexToReplace = toHighlight.findIndex(letterDraw => {
            return letterDraw.index === newLetterDraw.index;
        });

        toHighlight[indexToReplace] = newLetterDraw;
        return toHighlight;
    }

    public resetSteps() {
        this.steps = [];
        this.resetAdditionalVariables();
    }

    abstract resetAdditionalVariables() : void;

    set textLengthSetter(textLength : number) {
        this.textLength = textLength;
    }

    set preProcessingCanvasSetter(preProcessingCanvas : boolean) {
        this.preProcessingCanvas = preProcessingCanvas;
    }

    set preProcessingFunctionSetter(preProcessingFunction : string) {
        this.preProcessingFunction = preProcessingFunction;
    }

    get textLengthGetter() : number {
        return this.textLength;
    }

    get extraCanvasGetter() {
        if (this.preProcessingCanvas) return this.preProcessingFunction;
        return null;
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