import { StringMatchingAlgorithmToDraw } from "../drawers/algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { P5jsDrawClass } from "../drawers/p5js.drawer";



export class DrawerStub extends DrawStepDecorator {

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
    }

    override draw(drawingClass : P5jsDrawClass) : void {
        return
    }
}