import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";
import { AdditionalVariables } from "./additional-variables.model";

export class AlgorithmStep {

    pseudocodeLine : number;
    patternIndex = -1;
    textIndex = -1;
    patternElementColour = MatchingAlgorithmColourConstants.DEFAULT;
    textElementColour = MatchingAlgorithmColourConstants.DEFAULT;
    alreadyMatchedIndexesInPattern : number[] = [];
    alreadyMatchedIndexesInText : number[] = [];
    command : string;
    highlightText = false;
    highlightPattern = false;
    additional : AdditionalVariables;
}