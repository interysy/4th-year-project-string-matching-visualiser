import { AdditionalVariables } from "./additional-variables.model";

export class FullBoyerMooreAdditionalVariables extends AdditionalVariables {
    lastOccurrenceTable : {[character : string] : number; };
    goodSuffixTable : number[];
}