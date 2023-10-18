import { Injectable } from "@angular/core";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { AdditionalVariables } from "../models/additional-variables.model";
import { AlgorithmStepTypeConstants } from "../constants/algorithm-step-model.constant";
import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { BruteForceAdditionalVariables } from "../models/brute-force-additional-variables.model";
import { LetterDraw } from "../models/letter-draw.model";


@Injectable({
    providedIn: 'root'
})
export class AlgorithmStepBuilder {

    step : AlgorithmStep;

    constructor() {
        this.setDefaults();
    }

    public setDefaults() : void {
        this.step = {
            type : AlgorithmStepTypeConstants.PROCESSING,
            pseudocodeLine : 0,
            patternIndex : -1,
            textIndex : -1,
            alreadyMatchedIndexesInPattern : [],
            alreadyMatchedIndexesInText : [],
            command : "",
            highlightText : false,
            highlightPattern : false,
            additional : new AdditionalVariables,
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

    set setAlreadyMatchedIndexesInPattern(alreadyMatchedIndexesInPattern : LetterDraw[]) {
        this.step.alreadyMatchedIndexesInPattern = alreadyMatchedIndexesInPattern;
    }

    set setAlreadyMatchedIndexesInText(alreadyMatchedIndexesInText : LetterDraw[]) {
        this.step.alreadyMatchedIndexesInText = alreadyMatchedIndexesInText;
    }

    set setCommand(command : string) {
        this.step.command = command;
    }

    set setHighlightText(highlightText : boolean) {
        this.step.highlightText = highlightText;
    }

    set setHighlightPattern(highlightPattern : boolean) {
        this.step.highlightPattern = highlightPattern;
    }

    set setAdditional(additional : AdditionalVariables) {
        this.step.additional = additional;
    }

    set setType(type : AlgorithmStepTypeConstants) {
        this.step.type = type;
    }

    public build() {
        return JSON.parse(JSON.stringify(this.step));
    }
}
