import { AdditionalVariables } from "../../models/additional-variables.model";

/**
 * @description The additional variables needed for boyer-moore algorithm to run.
 */
export class BoyerMooreAdditionalVariables extends AdditionalVariables {
    startingPoint : number;
    lastOccurrenceTable : {[character : string] : number; };
    lastOccurrenceToHighlight : string;
}