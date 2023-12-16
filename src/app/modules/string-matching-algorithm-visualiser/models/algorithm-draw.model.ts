import { P5jsDrawService } from "../services/p5js-draw.service";


export interface StringMatchingAlgorithmToDraw {
    draw(obj : P5jsDrawService) : void;
}