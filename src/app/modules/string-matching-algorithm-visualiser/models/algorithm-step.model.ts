import { AdditionalVariables } from "./additional-variables.model";
import { Letter } from "./letter.model";

/**
 * @description A model used to format a single step of the algorithm. To be used by algorithms when creating steps, so all steps are consistent.
 * @property pseudocodeLine - The line of the pseudocode that the algorithm is currently on. Used by the pseudocode visualiser.
 * @property lettersInText - The letters in the text. Each letter is of the Letter object. @see Letter
 * @property lettersInPattern - The letters in the pattern.Each letter is of the Letter object. @see Letter
 * @property patternOffset - The offset of the pattern in comparison to the text.
 * @property textIndex - The index of the text.
 * @property patternIndex - The index of the pattern.
 * @property command - Explanation of what the algorithm is currently doing.
 * @property additional - Additional variables used in the algorithm. @see AdditionalVariables
 * @property extra - A boolean to check if the step is used in preprocessing or the main algorithm.
 * @property pseudocodeFilename - The source of the pseudocode used in the algorithm.
 */
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
    pseudocodeFilename : string;
}