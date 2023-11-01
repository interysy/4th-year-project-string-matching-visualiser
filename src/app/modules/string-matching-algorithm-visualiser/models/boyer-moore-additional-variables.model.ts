import { AdditionalVariables } from "./additional-variables.model";

export class BoyerMooreAdditionalVariables extends AdditionalVariables {
    startingPoint : number;
    lastOccuranceTable : { [character : string] : number; };
}