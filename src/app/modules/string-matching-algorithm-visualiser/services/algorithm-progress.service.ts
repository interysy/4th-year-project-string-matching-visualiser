import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BruteForceAdditionalVariables } from '../models/brute-force-additional-variables.model';
import { AdditionalVariables } from '../models/additional-variables.model';
import { StringMatchingAlgorithm } from '../models/algorithm.model';
import { Router } from '@angular/router';
import { BruteForceAlgorithm } from '../algorithms/brute-force/brute-force.algorithm';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmProgressService {

  currentStep : number;
  notifier : Subject<number> = new Subject<number>();
  amountOfSteps : number;
  text : string;
  pattern : string;

  constructor(private router : Router , private algorithm : StringMatchingAlgorithm) {

    if (! (algorithm instanceof BruteForceAlgorithm)) this.router.navigateByUrl("/");
    this.notifier.subscribe((value) => {
      this.currentStep = value
    });
  }

  public executeAlgorithm() {
    this.algorithm.workOutSteps(this.text, this.pattern);
    this.amountOfSteps = this.algorithm.stepsLength;
  }

  public setTextAndPattern(text : string, pattern : string) {
    this.text = text;
    this.pattern = pattern;
    this.executeAlgorithm();
  }

  set setText(text : string) {
    this.text = text;
    this.executeAlgorithm();
  }

  set setPattern(pattern : string) {
     this.pattern = pattern;
     this.executeAlgorithm();
  }

  public moveToNextStep() {
    this.notifier.next(this.currentStep + 1);
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

  get patternElementColour() {
    return this.algorithm.stepsGetter[this.currentStep].patternElementColour;
  }

  get textElementColour() {
    return this.algorithm.stepsGetter[this.currentStep].textElementColour;
  }

  get alreadyMatchedIndexesInPattern() {
    return this.algorithm.stepsGetter[this.currentStep].alreadyMatchedIndexesInPattern;
  }

  get alreadyMatchedIndexesInText() {
    return this.algorithm.stepsGetter[this.currentStep].alreadyMatchedIndexesInText;
  }

  get command() {
    return this.algorithm.stepsGetter[this.currentStep].command;
  }

  get highlightText() {
    return this.algorithm.stepsGetter[this.currentStep].highlightText;
  }

  get highlightPattern() {
    return this.algorithm.stepsGetter[this.currentStep].highlightPattern;
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

  // get startingPoint() {
  //   return this.algorithm.steps[this.currentStep].startingPoint;
  // }

  async play() {
    this.notifier.next(0);
    for (let i = 0; i < this.amountOfSteps; i++) {
        await this.sleep(2000);
        this.moveToNextStep();
      }
  }

  async sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }
}
