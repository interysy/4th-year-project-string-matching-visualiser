import * as p5 from "p5";
import { StringMatchingAlgorithmToDraw } from "../models/algorithm-draw.model";
import { DrawStepDecorator } from "../models/drawer-step.decorator";
import { AlgorithmStep } from "../models/algorithm-step.model";
import { P5jsDrawService } from "../services/p5js-draw.service";
import { Injector } from "@angular/core";


export class LastOccuranceTableDrawer extends DrawStepDecorator {
    p5jsDrawService: P5jsDrawService;

    constructor(earlierDrawer : StringMatchingAlgorithmToDraw) {
        super(earlierDrawer);
        this.p5jsDrawService = Injector.create({providers: [{provide: P5jsDrawService, deps: []}]}).get(P5jsDrawService);
    }

    override draw(p : p5 , step : AlgorithmStep) : void {
        this.earlierDrawer.draw(p, step);
        console.log(step);
        const lastOccuranceTable = (step.additional['lastOccuranceTable']) ? step.additional['lastOccuranceTable'] : [];
        this.p5jsDrawService.decenraliseDrawing(p,p.width,p.height);
        this.p5jsDrawService.workOutTextWidth(3);
        this.p5jsDrawService.centraliseDrawing(p,p.width,p.height-400);
        this.p5jsDrawService.drawLastOccuranceTable(p , lastOccuranceTable);
    }
}