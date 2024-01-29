import { StringMatchingAlgorithmToDraw } from "../drawers/algorithm-draw.model";
import { P5jsDrawClass } from "../drawers/p5js.drawer";

export abstract class DrawStepDecorator implements StringMatchingAlgorithmToDraw {
    earlierDrawer : StringMatchingAlgorithmToDraw;

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        this.earlierDrawer = earlierDrawer;
    }

    draw(obj : P5jsDrawClass) {
        this.earlierDrawer.draw(obj);
    }
}