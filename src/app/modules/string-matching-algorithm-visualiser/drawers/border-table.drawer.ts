import { StringMatchingAlgorithmToDraw } from "./algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { P5jsDrawClass } from "./p5js.drawer";



export class BorderTableDrawer extends DrawStepDecorator {

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
    }

    override draw(drawingClass : P5jsDrawClass) : void {
        drawingClass.annotatePattern();
        this.earlierDrawer.draw(drawingClass);
    }
}