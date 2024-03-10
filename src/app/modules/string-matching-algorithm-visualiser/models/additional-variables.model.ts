/**
 * @description A model used to store additional variables used in the algorithm.
 * It is to be overriden by the algorithm to store additional variables. The length properties are shared across all algorithms.
 * @property textLength - The length of the text.
 * @property patternLength - The length of the pattern.
 */
export class AdditionalVariables {
    textLength  : number;
    patternLength : number;
    [key: string]: any;
}