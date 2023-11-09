import * as p5 from "p5";
import { StringMatchingAlgorithmToDraw } from "../models/algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { P5jsDrawService } from "../services/p5js-draw.service";
import { Injector } from "@angular/core";


export class LastOccuranceTableDrawer extends DrawStepDecorator {
    p5jsDrawService: P5jsDrawService;
    lastOccuranceTable:{ [character : string] : number; } = {};

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
        this.p5jsDrawService = Injector.create({providers: [{provide: P5jsDrawService, deps: []}]}).get(P5jsDrawService);
    }

    override draw(p : p5 , step : AlgorithmStep , squareSideSize : number) : void {
        this.earlierDrawer.draw(p, step , squareSideSize);

        this.lastOccuranceTable = (step.additional['lastOccuranceTable']) ? step.additional['lastOccuranceTable'] : [];
        const lastOccuranceToHighlight = (step.additional['lastOccuranceToHighlight']) ? step.additional['lastOccuranceToHighlight'] : null;

        if (this.p5jsDrawService.activeWindow(p.width , squareSideSize , step.lettersInText.length)) {
            const patternWidth =  this.p5jsDrawService.workOutTextWidth(step.lettersInPattern.length + step.patternOffset , squareSideSize);
            this.p5jsDrawService.decentraliseDrawing(p,p.width,p.height, patternWidth + (step.patternOffset * squareSideSize));
        } else {
            const textWidth = this.p5jsDrawService.workOutTextWidth(step.lettersInText.length , squareSideSize);
            this.p5jsDrawService.decentraliseDrawing(p,p.width,p.height, textWidth);
        }
        this.p5jsDrawService.drawLastOccuranceTable(p , this.lastOccuranceTable , lastOccuranceToHighlight,  squareSideSize);
    }
}