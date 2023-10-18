import { Injectable } from "@angular/core";
import { AlgorithmStep } from "./algorithm-step.model";

@Injectable({
    providedIn: 'root'
})
export abstract class StringMatchingAlgorithm {

    private steps : AlgorithmStep[] = [];
    private textLength : number;
    private patternLength : number;

    abstract workOutSteps(text : string , pattern : string) : number;

    public addStep(algorithmStep : AlgorithmStep) {
        this.steps.push(algorithmStep);
    }

    set textLengthSetter(textLength : number) {
        this.textLength = textLength;
    }

    get textLengthGetter() : number {
        return this.textLength;
    }

    set patternLengthSetter(patternLength : number) {
        this.patternLength = patternLength;
    }

    get patternLengthGetter() : number {
        return this.patternLength;
    }

    get stepsGetter() : AlgorithmStep[] {
        return this.steps;
    }

     get stepsLength() : number {
        return this.steps.length;
    }

    resetSteps() {
        this.steps = [];
    }



}