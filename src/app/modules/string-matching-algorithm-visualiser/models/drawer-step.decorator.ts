import { StringMatchingAlgorithmToDraw } from "./algorithm-draw.model";
import { P5jsDrawService } from "../services/p5js-draw.service";

export abstract class DrawStepDecorator implements StringMatchingAlgorithmToDraw {
    earlierDrawer : StringMatchingAlgorithmToDraw;

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        this.earlierDrawer = earlierDrawer;
    }

    draw(obj : P5jsDrawService) {
        this.earlierDrawer.draw(obj);
    }
}