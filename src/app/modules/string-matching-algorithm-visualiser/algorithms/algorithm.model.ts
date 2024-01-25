import { AlgorithmStep } from "../models/algorithm-step.model";
import { AlgorithmStepBuilder } from "../model-builders/algorithm-step.builder";
import { LetterBuilder } from "../model-builders/letter.builder";
import { StringMatchingAlgorithmToDraw } from "../drawers/algorithm-draw.model";
import { P5jsDrawClass } from "../drawers/p5js.drawer";
import { ThemeSelectorService } from "../services/theme-selector.service";
import { Injector } from "@angular/core";
import { AdditionalVariables } from "../models/additional-variables.model";
import { environment } from "src/environments/environment.dev";
import { Letter } from "../models/letter.model";


/**
 * @description Abstract class that all string matching algorithms extend from. It implements an interface that is used to draw the algorithm via the decorator pattern.
 * @see StringMatchingAlgorithmToDraw
 */
export abstract class StringMatchingAlgorithm implements StringMatchingAlgorithmToDraw {

    /**
     * @description The steps that the algorithm takes to find the pattern in the text.
     */
    protected steps : AlgorithmStep[] = [];

    /**
     * @description The previous step of the algorithm. It is mainly used to copy properties of AlgorithmStep between steps, so these don't need to be defined again.
     */
    protected previousStep : AlgorithmStep;


    protected patternIndex = -1;
    protected textIndex = -1;
    protected text : string;
    protected pattern : string;

    /**
     * @description Algorithm name as a slug.
     * @example "naive-string-matching"
     */
    protected algorithmNameSlug : string;

    /**
     * @description Instance of an object that can be used to build an AlgorithmStepBuilder for the steps array. It abstracts the step creation process.
     * @see AlgorithmStepBuilder
     * @see AlgorithmStep
     * @see StringMatchingAlgorithm.steps
     */
    protected readonly algorithmStepBuilder: AlgorithmStepBuilder = new AlgorithmStepBuilder();

    /**
     * @description Instance of an object that can be used to build a Letter, which is used in properties of the AlgorithmStep object. Letters are used to draw on the canvas.
     * @see Letter
     * @see AlgorithmStep
     * @see P5jsDrawClass.drawTextAndPattern
     */
    protected readonly letterBuilder : LetterBuilder;

    /**
     * @description Algorithm specific attribute to determine whether an algorithm requires another canvas or not.
     */
    protected preProcessingCanvas : boolean;

    /**
     * @description A function name as a string that will be used to draw on the pre-processing (extra) canvas.
     */
    protected preProcessingFunction : string;

    /**
     * @description Instance of the theme selector service. It is used to get the current theme.
     */
    protected readonly themeSelectorService: ThemeSelectorService;


    protected additionalVariables : AdditionalVariables;


    /**
     * @description Abstract method that all string matching algorithms must implement. It is used to work out the steps that the algorithm takes to find the pattern in the text. It is typically the actual algorithm.
     * @param text
     * @param pattern
     */
    public abstract workOutSteps(text : string , pattern : string) : number;

    /**
     * @description Abstract method that all string matching algorithms must implement. It is used to add the steps that the algorithm takes before running - typically setting variables.
     */
    protected abstract addSetupSteps() : void;

    /**
     * @description Abstract method that all string matching algorithms must implement. It is used to add the steps corresponding to starting another iteration of the search process.
     */
    protected abstract addWhileLoopStep() : void;

    /**
     * @description Abstract method that all string matching algorithms must implement. It is used to add the steps corresponding to the comparison of current text and pattern letter.
     */
    protected abstract addCheckStep() : void;

    /**
     * @description Abstract method that all string matching algorithms must implement. It is used to add the steps corresponding to the case where the algorithm finds a full match.
     */
    protected abstract addFullMatchStep() : void;

    /**
     * @description Abstract method that all string matching algorithms must implement. It is used to add the steps corresponding to the case where the algorithm doesn't find a match.
     */
    protected abstract addNoSolutionStep() : void;

    /**
     * @description Abstract method that all string matching algorithms must implement. It is used to reset additional variables to the correct additional variables class.
     */
    protected abstract resetAdditionalVariables() : void;

    /**
     * @description Creating the class and injecting the theme selector service.
     */
    constructor() {
        this.themeSelectorService = Injector.create({providers: [{provide: ThemeSelectorService, deps: []}]}).get(ThemeSelectorService);
        this.letterBuilder = new LetterBuilder(this.themeSelectorService);
    }

    /**
     * @description Base method of the decorator pattern. It is a placeholder method.
     * @param drawingClass Instance of the class that will be used to draw the algorithm.
     */
    draw(drawingClass : P5jsDrawClass) : void {
        return;
    }

    /**
     * @description Adding anew step to the steps array.
     */
    protected addStep(addPreviousStep : boolean , setDefaults : boolean) : void {
        const currentStep = this.algorithmStepBuilder.build();
        this.steps.push(currentStep);
        if (setDefaults) this.algorithmStepBuilder.setDefaults();
        if (addPreviousStep) this.previousStep = this.algorithmStepBuilder.createDeepCopy(currentStep);
    }

    protected createLetterUsingBuilderUsingPrev(index : number , letter : string , colour : string , strokeWeight : number , setDefaults : boolean , textOrPattern : string) : Letter {
        this.letterBuilder.setIndex = index;
        this.letterBuilder.setLetter = letter;
        this.letterBuilder.setColor = colour;
        this.letterBuilder.setStrokeWeight = strokeWeight;
        if (textOrPattern === "text") this.algorithmStepBuilder.setLettersInText = this.letterBuilder.replaceLetter(this.previousStep.lettersInText, this.letterBuilder.build());
        else if (textOrPattern === "pattern") this.algorithmStepBuilder.setLettersInPattern = this.letterBuilder.replaceLetter(this.previousStep.lettersInPattern, this.letterBuilder.build());

        if (setDefaults) this.letterBuilder.setDefaults();
        return this.letterBuilder.build();
    }

    protected createLetterUsingBuilderUsingArray(index : number , letter : string , colour : string , strokeWeight : number , setDefaults : boolean , letterArray : Letter[]) : Letter[] {
        this.letterBuilder.setIndex = index;
        this.letterBuilder.setLetter = letter;
        this.letterBuilder.setColor = colour;
        this.letterBuilder.setStrokeWeight = strokeWeight;
        const builtLetter = this.letterBuilder.build();
        this.letterBuilder.replaceLetter(letterArray, builtLetter);

        if (setDefaults) this.letterBuilder.setDefaults();
        return letterArray;
    }



    /**
     * @description Resetting the steps array and additional variables. This is triggered when text or pattern is changed.
     */
    public resetSteps() : void {
        this.steps = [];
        this.resetAdditionalVariables();
    }



    set preProcessingCanvasSetter(preProcessingCanvas : boolean) {
        this.preProcessingCanvas = preProcessingCanvas;
    }

    set preProcessingFunctionSetter(preProcessingFunction : string) {
        this.preProcessingFunction = preProcessingFunction;
    }


    get textLengthGetter() : number {
        return this.additionalVariables.textLength;
    }

    get extraCanvasGetter() {
        if (this.preProcessingCanvas) return this.preProcessingFunction;
        return null;
    }

    get patternLengthGetter() : number {
        return this.additionalVariables.patternLength;
    }

    get stepsGetter() : AlgorithmStep[] {
        return this.steps;
    }

    get stepsLengthGetter() : number {
        return this.steps.length;
    }

    get algorithmNameGetter() : string {
        return this.algorithmNameSlug;
    }

    get additionalVariablesGetter() : AdditionalVariables {
        return this.additionalVariables;
    }


    // TESTER METHODS

    get setUpStepsTesterGetter() : AlgorithmStep[] {
        if (environment.type === "dev") {
            this.addSetupSteps();
            return this.steps;
        }

        throw new Error("Attempting to use a dev function from a non-dev environment");
    }

    public textAndPatternTesterSetter(text : string , pattern : string) {
        if (environment.type === "dev") {
            this.text = text;
            this.pattern = pattern;
        } else {
            throw new Error("Attempting to use a dev function from a non-dev environment");
        }

    }

    public textAndPatternIndexTesterSetter(textIndex : number , patternIndex : number) {
        if (environment.type == "dev") {
            this.textIndex = textIndex;
            this.patternIndex = patternIndex;
        } else {
            throw new Error("Attempting to use a dev function from a non-dev environment");
        }
    }

    public previousStepTesterSetter(previousStep : AlgorithmStep) {
        if (environment.type == "dev") {
            this.previousStep = previousStep;
        } else {
            throw new Error("Attempting to use a dev function from a non-dev environment");
        }
    }
}