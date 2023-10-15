import { Injectable } from "@angular/core";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { AdditionalVariables } from "../models/additional-variables.model";
import { AlgorithmStepTypeConstants } from "../constants/algorithm-step-model.constant";


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
            patternElementColour : MatchingAlgorithmColourConstants.DEFAULT,
            textElementColour : MatchingAlgorithmColourConstants.DEFAULT,
            alreadyMatchedIndexesInPattern : [],
            alreadyMatchedIndexesInText : [],
            command : "",
            highlightText : false,
            highlightPattern : false,
            additional : {},
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

    set setPatternElementColour(patternElementColour : string) {
        this.step.patternElementColour = patternElementColour;
    }

    set setTextElementColour(textElementColour : string) {
        this.step.textElementColour = textElementColour;
    }

    set setAlreadyMatchedIndexesInPattern(alreadyMatchedIndexesInPattern : number[]) {
        this.step.alreadyMatchedIndexesInPattern = alreadyMatchedIndexesInPattern;
    }

    set setAlreadyMatchedIndexesInText(alreadyMatchedIndexesInText : number[]) {
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
