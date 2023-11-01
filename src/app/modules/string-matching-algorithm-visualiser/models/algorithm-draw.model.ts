import * as p5 from "p5";
import { AlgorithmStep } from "./algorithm-step.model";


export interface StringMatchingAlgorithmToDraw {
    draw(p : p5 , step : AlgorithmStep) : void;
}