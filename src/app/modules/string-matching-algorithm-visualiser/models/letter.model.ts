import { MatchingAlgorithmColourConstants } from "../constants/matching-algorithm-colours.constant";

export interface Letter {
    index : number;
    colour : MatchingAlgorithmColourConstants;
    strokeWeight : number;
}