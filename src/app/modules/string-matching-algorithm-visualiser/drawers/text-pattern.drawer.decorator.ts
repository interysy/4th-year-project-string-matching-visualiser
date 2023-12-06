import * as p5 from "p5";
import { StringMatchingAlgorithmToDraw } from "../models/algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { P5jsDrawService } from "../services/p5js-draw.service";
import { Injector } from "@angular/core";


export class TextAndPatternDrawer extends DrawStepDecorator {

    private p5jsDrawService : P5jsDrawService;
    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
        this.p5jsDrawService = Injector.create({providers: [{provide: P5jsDrawService, deps: []}]}).get(P5jsDrawService);

    }

    override draw(p : p5 ) : void {
        console.log("layer 2");
        // this.earlierDrawer.draw(p , step , squareSideSize);
        // const textLettersToDrawFromStep = step.lettersInText;
        // const patternLettersToDrawFromStep = step.lettersInPattern;
        // const patternOffsetFromStep = step.patternOffset;
        // this.p5jsDrawService.drawTextAndPattern(p , textLettersToDrawFromStep , patternLettersToDrawFromStep , patternOffsetFromStep , squareSideSize);
    }
}