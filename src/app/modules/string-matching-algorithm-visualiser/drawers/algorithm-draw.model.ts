import { P5jsDrawClass } from "./p5js.drawer";


/**
 * @description An interface for string matching algorithm to implement. It creates the base layer to draw.
 */
export interface StringMatchingAlgorithmToDraw {

    /**
     * @description Method which is the last thing to draw on the canvas.
     * @param obj The object on which canvas the function will draw on.
     */
    draw(obj : P5jsDrawClass) : void;
}