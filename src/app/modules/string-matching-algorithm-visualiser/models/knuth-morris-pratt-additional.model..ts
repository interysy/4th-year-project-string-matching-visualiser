import { AdditionalVariables } from "./additional-variables.model";
import { Letter } from "./letter.model";

export class KnuthMorrisPrattAdditionalVariables extends AdditionalVariables {
    borderTable : number[];
    borderTableLetters : Letter[];
    borderOne : [number, number];
    borderTwo : [number, number];
    i : number;
    j : number;
}