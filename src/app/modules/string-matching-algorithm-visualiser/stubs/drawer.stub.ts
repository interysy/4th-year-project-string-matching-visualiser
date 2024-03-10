import { StringMatchingAlgorithmToDraw } from "../drawers/algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { P5jsDrawClass } from "../drawers/p5js.drawer";


/**
 * @description A testing stub used to replace a drawing layer .
 * It implements dummy methods, which can be used to test anything using drawers such as P5JsDrawClass.
 * @see P5JsDrawClass
 */
export class DrawerStub extends DrawStepDecorator {

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
    }

    override draw(drawingClass : P5jsDrawClass) : void {
        return
    }
}