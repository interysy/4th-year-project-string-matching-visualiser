import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { StringMatchingAlgorithm } from '../models/algorithm.model';
import { Router } from '@angular/router';
import { BruteForceAlgorithm } from '../algorithms/brute-force.algorithm';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmProgressService {

  currentStep = -1;
  notifier : Subject<number> = new Subject<number>();
  amountOfSteps : number;
  text : string;
  pattern : string;
  private algorithm : StringMatchingAlgorithm;
  private algorithmName : string;

  constructor(private router : Router , private injector : Injector) {

    this.notifier.subscribe((value) => {
      this.currentStep = value
    });
  }

  public injectAlgorithm(algorithmToInject : string) {
    switch (algorithmToInject) {
      case "BruteForceAlgorithm" : {
        this.algorithm = this.injector.get(BruteForceAlgorithm);
        this.algorithmName = "brute-force";
        break;
      }
      default : {
        throw new Error ("Algorithm not implemented");
      }
    }
  }

  public executeAlgorithm() {
    this.algorithm.workOutSteps(this.text, this.pattern);
    this.amountOfSteps = this.algorithm.stepsLength;
    console.log(this.algorithm.stepsGetter);
  }

  public setTextAndPattern(text : string, pattern : string) {
    this.text = text;
    this.pattern = pattern;
    this.algorithm.resetSteps();
    console.log(this.algorithm.stepsGetter)
    this.executeAlgorithm();
  }

  public reset() {
    this.algorithm.resetSteps();
  }

  set setText(text : string) {
    this.text = text;
    this.algorithm.resetSteps();
    this.executeAlgorithm();
  }

  set setPattern(pattern : string) {
     this.pattern = pattern;
     this.algorithm.resetSteps();
     this.executeAlgorithm();
  }

  public moveToNextStep() {
    console.log("Next step");
    this.notifier.next(this.currentStep + 1);
  }

  public goToPreviousStep() {
    this.notifier.next(this.currentStep - 1);
  }

  get stepGetter() {
    return this.algorithm.stepsGetter[this.currentStep];
  }
  get currentStepNumber() {
    return this.currentStep;
  }

  get pseudocodeLine() {
    return this.algorithm.stepsGetter[this.currentStep].pseudocodeLine;
  }

  get patternIndex() {
    return this.algorithm.stepsGetter[this.currentStep].patternIndex;
  }

  get textIndex() {
    return this.algorithm.stepsGetter[this.currentStep].textIndex;
  }


  get command() {
    return this.algorithm.stepsGetter[this.currentStep].command;
  }


  get textLength() {
    return this.algorithm.textLengthGetter;
  }

  get patternLength() {
    return this.algorithm.patternLengthGetter;
  }

  get additionalVariables() {
    return this.algorithm.stepsGetter[this.currentStep].additional;
  }

  get algorithmNameGetter() {
    return this.algorithmName;
  }

  async play() {
    this.notifier.next(0);
    for (let i = 0; i < this.amountOfSteps; i++) {
        await this.sleep(200);
        console.log("Moving to new staep");
        this.moveToNextStep();
      }
  }

  async sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }
}
