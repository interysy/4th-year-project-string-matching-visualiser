import { Injectable } from '@angular/core';
import { BruteForceAlgorithm } from '../algorithms/brute-force.algorithm';
import { Subject } from 'rxjs';
import { BruteForceAdditionalVariables } from '../models/brute-force-additional-variables.model';
import { AdditionalVariables } from '../models/additional-variables.model';

@Injectable({
  providedIn: 'root'
})
export class PlaybackServiceService {

  currentStep : number;
  notifier : Subject<number> = new Subject<number>();
  amountOfSteps : number;

  constructor(private bruteForceAlgorithm : BruteForceAlgorithm) {
    bruteForceAlgorithm.workOutSteps("hello" , "ll");
    this.amountOfSteps = bruteForceAlgorithm.stepsLength;

    this.notifier.subscribe((value) => {
      this.currentStep = value
  });
  }

  moveToNextStep() {
    this.notifier.next(this.currentStep + 1);
  }

  get currentStepNumber() {
    return this.currentStep;
  }

  get pseudocodeLine() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].pseudocodeLine;
  }

  get patternIndex() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].patternIndex;
  }

  get textIndex() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].textIndex;
  }

  get patternElementColour() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].patternElementColour;
  }

  get textElementColour() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].textElementColour;
  }

  get alreadyMatchedIndexesInPattern() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].alreadyMatchedIndexesInPattern;
  }

  get alreadyMatchedIndexesInText() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].alreadyMatchedIndexesInText;
  }

  get command() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].command;
  }

  get highlightText() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].highlightText;
  }

  get highlightPattern() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].highlightPattern;
  }

  get textLength() {
    return this.bruteForceAlgorithm.textLengthGetter;
  }

  get patternLength() {
    return this.bruteForceAlgorithm.patternLengthGetter;
  }

  get additionalVariables() {
    return this.bruteForceAlgorithm.stepsGetter[this.currentStep].additional;
  }

  // get startingPoint() {
  //   return this.bruteForceAlgorithm.steps[this.currentStep].startingPoint;
  // }

  async play() {
    this.notifier.next(0);
    for (let i = 0; i < this.amountOfSteps; i++) {
        await this.sleep(500);
        this.moveToNextStep();
      }
  }

  async sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }
}
