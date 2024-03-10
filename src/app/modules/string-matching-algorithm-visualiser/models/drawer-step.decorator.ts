import { StringMatchingAlgorithmToDraw } from "../drawers/algorithm-draw.model";
import { P5jsDrawClass } from "../drawers/p5js.drawer";

/**
 * @description A decorator used to add a drawing step to the algorithm.
 * It is a drawing layer, drawing something, then calling an earlier layer for drawing.
 */
export abstract class DrawStepDecorator implements StringMatchingAlgorithmToDraw {
    earlierDrawer : StringMatchingAlgorithmToDraw;

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        this.earlierDrawer = earlierDrawer;
    }

    draw(obj : P5jsDrawClass) {
        this.earlierDrawer.draw(obj);
    }
}