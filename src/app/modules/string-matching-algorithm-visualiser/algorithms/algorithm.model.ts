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

    /**
     * @description Pattern index of the algorithm, changes with execution.
     */
    protected patternIndex = -1;


    /**
     * @description Text index of the algorithm, changes with execution.
     */
    protected textIndex = -1;

    /**
     * @description Text set to execute with algorithm.
     */
    protected text : string;

    /**
     * @description Pattern set to execute with algorithm.
     */
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


    /**
     * @description The additional variables required for a specific algorithm to execute. This is to be overriden.
     */
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
    public abstract resetAdditionalVariables() : void;

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

    /**
     * @description Function to check if pattern or text is long enough to use in execution. If so a step telling the user this is created.
     * @param text Current text set in the modal.
     * @param pattern Current pattern set in the modal
     * @returns boolean Whether text or pattern is long enough.
     */
    protected tooLongPatternOrText(text : string , pattern : string) : boolean {
        if (text.length < 1 || pattern.length < 1) {
            this.algorithmStepBuilder.setCommand = "Pattern or text is nothing, cannot conitnue execution";
            if (text.length > 0) this.algorithmStepBuilder.setLettersInText = LetterBuilder.highlightEntireLine(text , "MISMATCH", 1);
            if (pattern.length > 0) this.algorithmStepBuilder.setLettersInPattern = LetterBuilder.highlightEntireLine(pattern, "MISMATCH", 1);
            this.addStep(false , true);
            return true;
        }
        return false;
    }

    /**
     * @description Function to create a new letter based on the previous step. Replaced letter in lettersInText and lettersInPattern. A helper method.
     * @param index Letter index.
     * @param letter Symbol to create letter object with.
     * @param colour The colour for highlighting character square.
     * @param strokeWeight The weight of border of square for character in the animation.
     * @param setDefaults Boolean denoting whether the builder should be reset after creation of step.
     * @param textOrPattern Whether we are creating the letter for the text or the pattern.
     * @returns Letter The letter object created.
     */
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

    /**
     * @description Function to create a new letter based on letter array passed in.  A helper method.
     * @param index Letter index.
     * @param letter Symbol to create letter object with.
     * @param colour The colour for highlighting character square.
     * @param strokeWeight The weight of border of square for character in the animation.
     * @param setDefaults Boolean denoting whether the builder should be reset after creation of step.
     * @param letterArray Where to put the letter in. It replaces.
     * @returns Letter The letter object created.
     */
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
        this.algorithmStepBuilder.setDefaults()
        this.previousStep = this.algorithmStepBuilder.build();
        this.resetAdditionalVariables();
    }


    /**
     * @description Method to set the preProcessingCanvas variable - whether the algorithm requires extra canvas.
     */
    set preProcessingCanvasSetter(preProcessingCanvas : boolean) {
        this.preProcessingCanvas = preProcessingCanvas;
    }

    /**
     * @description Method to set the preProcessingFunction variable - what function algorithm will run to draw on the extra canvas.
     */
    set preProcessingFunctionSetter(preProcessingFunction : string) {
        this.preProcessingFunction = preProcessingFunction;
    }

    /**
     * @description Method to grab textLength from additional variables of algorithm.
     */
    get textLengthGetter() : number {
        return this.additionalVariables.textLength;
    }

    /**
     * @description Method to grab variable to determine whetehr extra canvas is needed and what function will draw on it.
     */
    get extraCanvasGetter() {
        if (this.preProcessingCanvas) return this.preProcessingFunction;
        return null;
    }

    /**
     * @description Method to grab patternLength from additional variables of algorithm.
     */
    get patternLengthGetter() : number {
        return this.additionalVariables.patternLength;
    }

    /**
     * @description Method to grab steps created by algorithm.
     */
    get stepsGetter() : AlgorithmStep[] {
        return this.steps;
    }

    /**
     * @description Method to grab amount of steps created by algorithm.
     */
    get stepsLengthGetter() : number {
        return this.steps.length;
    }

    /**
     * @description Method to grab name of the algorithm currently being executed.
     */
    get algorithmNameGetter() : string {
        return this.algorithmNameSlug;
    }

    /**
     * @description Method to grab al additional variables for an algorithm.
     */
    get additionalVariablesGetter() : AdditionalVariables {
        return this.additionalVariables;
    }


    // TESTER METHODS

    /**
     * @description Tester method used to create only setup steps for the algorithm, so these can be tested.
     * @throws Error When not in development environment.
     */
    get setUpStepsTesterGetter() : AlgorithmStep[] {
        if (environment.type === "dev") {
            this.addSetupSteps();
            return this.steps;
        }

        throw new Error("Attempting to use a dev function from a non-dev environment");
    }

    /**
     * @description Tester method used to set text and pattern. Can help different execution paths depending on what text and pattern are.
     * @throws Error When not in development environment.
     */
    public textAndPatternTesterSetter(text : string , pattern : string) : void {
        if (environment.type === "dev") {
            this.text = text;
            this.pattern = pattern;
        } else {
            throw new Error("Attempting to use a dev function from a non-dev environment");
        }

    }

    /**
     * @description Tester method used to set textIndex and patternIndex.
     * @throws Error When not in development environment.
     */
    public textAndPatternIndexTesterSetter(textIndex : number , patternIndex : number) : void {
        if (environment.type == "dev") {
            this.textIndex = textIndex;
            this.patternIndex = patternIndex;
        } else {
            throw new Error("Attempting to use a dev function from a non-dev environment");
        }
    }

    /**
     * @description Used to set previous step, which is used often used to create subsequent steps. This can help create previous step to one we are testing.
     * @param previousStep The step to set previousStep to
     * @throws Error When not in development environment.
     */
    public previousStepTesterSetter(previousStep : AlgorithmStep) : void {
        if (environment.type == "dev") {
            this.previousStep = previousStep;
        } else {
            throw new Error("Attempting to use a dev function from a non-dev environment");
        }
    }
}