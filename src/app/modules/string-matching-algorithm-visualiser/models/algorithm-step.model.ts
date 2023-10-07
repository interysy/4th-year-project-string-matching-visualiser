import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";

export interface AlgorithmStep {

    pseudocodeLine : number;
    patternIndex : number;
    textIndex : number;
    patternElementColour : MatchingAlgorithmColourConstants;
    textElementColour : MatchingAlgorithmColourConstants;
    alreadyMatchedIndexesInPattern : number[];
    alreadyMatchedIndexesInText : number[];
    command : string;
    highlightText : boolean;
    highlightPattern : boolean;
}