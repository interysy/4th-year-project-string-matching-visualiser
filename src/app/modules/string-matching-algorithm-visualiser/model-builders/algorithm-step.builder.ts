import { Injectable } from "@angular/core";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { AdditionalVariables } from "../models/additional-variables.model";


@Injectable({
    providedIn: 'root'
})
export class AlgorithmStepBuilder {

    step : AlgorithmStep;

    constructor() {
        this.step = {
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

    set pseudocodeLine(pseudocodeLine : number) {
        this.step.pseudocodeLine = pseudocodeLine;
    }

    set patternIndex(patternIndex : number) {
        this.patternIndex = patternIndex;
    }

    set textIndex(textIndex : number) {
        this.textIndex = textIndex;
    }

    set patternElementColour(patternElementColour : string) {
        this.patternElementColour = patternElementColour;
    }

    set textElementColour(textElementColour : string) {
        this.textElementColour = textElementColour;
    }

    set alreadyMatchedIndexesInPattern(alreadyMatchedIndexesInPattern : number[]) {
        this.alreadyMatchedIndexesInPattern = alreadyMatchedIndexesInPattern;
    }

    set alreadyMatchedIndexesInText(alreadyMatchedIndexesInText : number[]) {
        this.alreadyMatchedIndexesInText = alreadyMatchedIndexesInText;
    }

    set command(command : string) {
        this.command = command;
    }

    set highlightText(highlightText : boolean) {
        this.highlightText = highlightText;
    }

    set highlightPattern(highlightPattern : boolean) {
        this.highlightPattern = highlightPattern;
    }

    set additional(additional : AdditionalVariables) {
        this.additional = additional;
    }

    build() {
        return JSON.parse(JSON.stringify(this.step));
    }
}
