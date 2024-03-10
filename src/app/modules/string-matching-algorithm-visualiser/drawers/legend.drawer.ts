import { StringMatchingAlgorithmToDraw } from "./algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { P5jsDrawClass } from "./p5js.drawer";


/**
 * @description A drawing layer, used to draw the legend for the animation.
 */
export class LegendDrawer extends DrawStepDecorator {

    /**
     * @description Constructor initialises the layer and takes in an earlier one to call once finished.
     * @param earlierDrawer Earlier layer.
     */
    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
    }

     /**
     * @description Function that actually draws the legend on the canvas. It calls an earlier layer when finished to continue drawing.
     * @param drawingClass The object of which canvas we will draw on.
     */
    override draw(drawingClass : P5jsDrawClass) : void {
        drawingClass.drawLegend();
        this.earlierDrawer.draw(drawingClass);
    }
}