import { AlgorithmStepTypeConstants } from "../constants/algorithm-step-model.constant";
import { AdditionalVariables } from "./additional-variables.model";
import { LetterDraw } from "./letter-draw.model";

export class AlgorithmStep {

    type : AlgorithmStepTypeConstants;
    pseudocodeLine : number;
    patternIndex = -1;
    textIndex = -1;
    alreadyMatchedIndexesInPattern : LetterDraw[] = [];
    alreadyMatchedIndexesInText : LetterDraw[] = [];
    command : string;
    highlightText = false;
    highlightPattern = false;
    additional : AdditionalVariables;
}