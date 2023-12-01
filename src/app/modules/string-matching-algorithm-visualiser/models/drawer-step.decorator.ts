import * as p5 from "p5";
import { StringMatchingAlgorithmToDraw } from "./algorithm-draw.model";
import { AlgorithmStep } from "./algorithm-step.model";


export abstract class DrawStepDecorator implements StringMatchingAlgorithmToDraw {
    earlierDrawer : StringMatchingAlgorithmToDraw;

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        this.earlierDrawer = earlierDrawer;
    }

    draw(p : p5) {
        this.earlierDrawer.draw(p);
    }
}