import * as p5 from "p5";
import { StringMatchingAlgorithmToDraw } from "./algorithm-draw.model";
import { AlgorithmStep } from "./algorithm-step.model";


export abstract class DrawStepDecorator implements StringMatchingAlgorithmToDraw {
    earlierDrawer : StringMatchingAlgorithmToDraw;

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        this.earlierDrawer = earlierDrawer;
    }

    draw(p : p5 , step : AlgorithmStep , squareSideSize : number) {
        this.earlierDrawer.draw(p , step , squareSideSize);
    }
}