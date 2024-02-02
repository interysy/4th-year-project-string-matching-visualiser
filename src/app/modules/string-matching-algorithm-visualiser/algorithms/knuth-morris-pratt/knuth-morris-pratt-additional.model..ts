import { AdditionalVariables } from "../../models/additional-variables.model";

export class KnuthMorrisPrattAdditionalVariables extends AdditionalVariables {
    borderTable : number[];
    borderTableIndexToHighlight : number | null;
    borderOne : [number, number];
    borderTwo : [number, number];
    i : number;
    j : number;
}