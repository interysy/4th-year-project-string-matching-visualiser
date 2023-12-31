import { StringMatchingAlgorithmToDraw } from "../models/algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { P5jsDrawService } from "../services/p5js-draw.service";



export class LegendDrawer extends DrawStepDecorator {

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
    }

    override draw(drawingClass : P5jsDrawService) : void {
        drawingClass.drawLegend();
        this.earlierDrawer.draw(drawingClass);
    }
}