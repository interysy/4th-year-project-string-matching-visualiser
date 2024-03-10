import { AdditionalVariables } from "../../models/additional-variables.model";

/**
 * @description The additional variables needed for KMP algorithm to run.
 */
export class KnuthMorrisPrattAdditionalVariables extends AdditionalVariables {
    borderTable : number[];
    borderTableIndexToHighlight : number | null;
    borderOne : [number, number];
    borderTwo : [number, number];
    i : number;
    j : number;
}