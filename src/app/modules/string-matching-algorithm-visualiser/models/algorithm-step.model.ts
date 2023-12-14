import { AdditionalVariables } from "./additional-variables.model";
import { Letter } from "./letter.model";

export interface AlgorithmStep {
    pseudocodeLine : number;
    lettersInText : Letter[];
    lettersInPattern : Letter[];
    patternOffset : number;
    textIndex : number;
    patternIndex : number;
    command : string;
    additional : AdditionalVariables;
    extra : boolean;
}