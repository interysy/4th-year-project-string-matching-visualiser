import { AdditionalVariables } from "./additional-variables.model";

export class BoyerMooreAdditionalVariables extends AdditionalVariables {
    startingPoint : number;
    lastOccurrenceTable : {[character : string] : number; };
    lastOccurrenceToHighlight : string;
}