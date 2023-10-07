import { Injectable } from "@angular/core";
import { AlgorithmStep } from "./algorithm-step.model";

@Injectable({
    providedIn: 'root'
})
export abstract class StringMatchingAlgorithm {

    steps : AlgorithmStep[] = [];

    abstract workOutSteps(text : string , pattern : string) : number;

    public addStep(algorithmStep : AlgorithmStep) {
        this.steps.push(algorithmStep);
    }
}