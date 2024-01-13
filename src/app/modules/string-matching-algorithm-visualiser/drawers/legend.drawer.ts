import { StringMatchingAlgorithmToDraw } from "../models/algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { P5jsDrawClass } from "./p5js.drawer";



export class LegendDrawer extends DrawStepDecorator {

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
    }

    override draw(drawingClass : P5jsDrawClass) : void {
        drawingClass.drawLegend();
        this.earlierDrawer.draw(drawingClass);
    }
}