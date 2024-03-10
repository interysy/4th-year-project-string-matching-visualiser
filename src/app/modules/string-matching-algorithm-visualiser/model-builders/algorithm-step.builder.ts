import { AlgorithmStep } from "../models/algorithm-step.model";
import { AdditionalVariables } from "../models/additional-variables.model";
import { Letter } from "../models/letter.model";

/**
 * @description A builder class used to build AlgorithmStep objects.
 */
export class AlgorithmStepBuilder {

    /**
     * @description The step to be built.
     */
    step : AlgorithmStep;

    /**
     * @description The constructor of the AlgorithmStepBuilder. It sets the step to have default values.
     */
    constructor() {
        this.setDefaults();
    }

    /**
     * @description A method used to set the step to have default values. Used upon initialisation of builder or when needing to reset.
     */
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

    /**
     * @description A method used to set the pseudocode line of the step.
     * @param pseudocodeLine - Line number to set.
     */
    set setPseudocodeLine(pseudocodeLine : number) {
        this.step.pseudocodeLine = pseudocodeLine;
    }

    /**
     * @description A method used to set the patternIndex of the step.
     * @param patternIndex The index to set the patternIndex of builder to.
     */
    set setPatternIndex(patternIndex : number) {
        this.step.patternIndex = patternIndex;
    }

    /**
     * @description A method used to set the textIndex of the step.
     * @param textIndex The index to set the textIndex of builder to.
     */
    set setTextIndex(textIndex : number) {
        this.step.textIndex = textIndex;
    }

    /**
     * @description A method used to set the letters of text to draw in the step.
     */
    set setLettersInText(lettersInText : Letter[]) {
        this.step.lettersInText = lettersInText;
    }

    /**
     * @description A method used to set the letters of pattern to draw in the step.
     */
    set setLettersInPattern(lettersInPattern : Letter[]) {
        this.step.lettersInPattern = lettersInPattern;
    }

    /**
     * @description A method used to set the patternOffset of pattern in the step.
     */
    set setPatternOffset(patternOffset : number) {
        this.step.patternOffset = patternOffset;
    }

    /**
     * @description A method used to set the explanation of current step.
     */
    set setCommand(command : string) {
        this.step.command = command;
    }

    /**
     * @description A method used to set the additional variables of the step.
     */
    set setAdditional(additional : AdditionalVariables) {
        this.step.additional = additional;
    }

    /**
     * @description A method used to specify whether current step is used in preprocessing or the main algorithm.
     */
    set setExtra(extra : boolean) {
        this.step.extra = extra;
    }

    /**
     * @description A method used to set the filename to access for pseudocode.
     */
    set setPseudocodeFilename(pseudocodeFilename : string) {
        this.step.pseudocodeFilename = pseudocodeFilename;
    }

    /**
     * @description Creates a new step with no references to the builder.
     * @param step The step to create a deep copy of.
     */
    public createDeepCopy(step : AlgorithmStep) : AlgorithmStep {
        return JSON.parse(JSON.stringify(step));
    }

    /**
     * @description A method used to build the step.
     */
    public build() : AlgorithmStep {
        return JSON.parse(JSON.stringify(this.step));
    }
}
