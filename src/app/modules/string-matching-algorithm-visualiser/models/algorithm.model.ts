import { AlgorithmStep } from "./algorithm-step.model";
import { AlgorithmStepBuilder } from "../model-builders/algorithm-step.builder";
import { LetterBuilder } from "../model-builders/letter.builder";
import { Letter } from "./letter.model";
import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import * as p5 from "p5";
import { StringMatchingAlgorithmToDraw } from "./algorithm-draw.model";
import { Injector } from "@angular/core";
import { P5jsDrawService } from "../services/p5js-draw.service";

export abstract class StringMatchingAlgorithm implements StringMatchingAlgorithmToDraw {

    protected steps : AlgorithmStep[] = [];
    protected textLength : number;
    protected patternLength : number;
    protected previousStep : AlgorithmStep;
    protected text : string;
    protected pattern : string;
    protected algorithmName : string;
    protected readonly algorithmStepBuilder: AlgorithmStepBuilder = new AlgorithmStepBuilder();
    protected readonly letterBuilder : LetterBuilder = new LetterBuilder();
    p5jsDrawService : P5jsDrawService;

    protected preProcessingCanvas : boolean;
    protected preProcessingFunction : string;

    abstract workOutSteps(text : string , pattern : string) : number;
    protected abstract addSetupSteps(textLength : number , patternLength  : number) : void;

    constructor(algorithmName : string) {
        this.algorithmName = algorithmName;
         this.p5jsDrawService = Injector.create({providers: [{provide: P5jsDrawService, deps: []}]}).get(P5jsDrawService);
    }

    draw(p : p5 , step : AlgorithmStep , squareSideSize : number) : void {
        p.background(255);
        const textLettersToDrawFromStep = step.lettersInText;
        if (this.p5jsDrawService.activeWindow(p.width , squareSideSize , textLettersToDrawFromStep.length)) {
            const patternWidth =  this.p5jsDrawService.workOutTextWidth(step.lettersInPattern.length + step.patternOffset , squareSideSize);
            this.p5jsDrawService.centraliseDrawing(p, p.width , p.height , patternWidth + (step.patternOffset * squareSideSize));
        } else {
            const textWidth = this.p5jsDrawService.workOutTextWidth(textLettersToDrawFromStep.length , squareSideSize);
            this.p5jsDrawService.centraliseDrawing(p, p.width , p.height , textWidth);
        }
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
        console.log(this.preProcessingCanvas);
        console.log(this.preProcessingFunction);
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