import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StringMatchingAlgorithm } from '../models/algorithm.model';
import { DrawStepDecorator } from '../models/drawer-step.decorator';
import { StringMatchingAlgorithmToDraw } from '../models/algorithm-draw.model';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmProgressService {

  currentlyPlaying = false;
  currentStep = 0;
  notifier : Subject<number> = new Subject<number>();
  amountOfSteps : number;
  text : string;
  pattern : string;
  private algorithm : StringMatchingAlgorithm;
  private speed = 1000;
  decoratedAlgorithm : DrawStepDecorator

  constructor() {
    this.notifier.subscribe((value : number) => {
      this.currentStep = value
    });
  }

  public injectAlgorithm(algorithmToInject : { new (algorithmName : string): StringMatchingAlgorithm } , algorithmName : string , decorators : { new (decoratorName : StringMatchingAlgorithmToDraw): DrawStepDecorator }[] ) {

    this.resetProgressService();
    this.algorithm = new algorithmToInject(algorithmName);
    if (decorators.length !== 0) {
      let oldDecorator = this.algorithm as unknown as StringMatchingAlgorithmToDraw;
      for (const decorator of decorators) {
        this.decoratedAlgorithm = new decorator(oldDecorator);
        oldDecorator = this.decoratedAlgorithm;
      }
    }
  }

  public executeAlgorithm() {
    this.algorithm.workOutSteps(this.text, this.pattern);
    this.amountOfSteps = this.algorithm.stepsLengthGetter;
    this.notifier.next(0);
  }

  public setTextAndPattern(text : string, pattern : string) {
    this.text = text;
    this.pattern = pattern;
    this.algorithm.resetSteps();
    this.executeAlgorithm();
  }

  public reset() {
    this.currentlyPlaying = false;
    this.notifier.next(0);
  }

  public resetProgressService() {
    this.currentlyPlaying = false;
    this.currentStep = 0;
    this.amountOfSteps = 0;
    this.text = "";
    this.speed = 1000;
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
    if (this.currentStep != this.amountOfSteps - 1) {
      this.notifier.next(this.currentStep + 1);
    }
  }

  public moveToPreviousStep() {
    if (this.currentStep > 0) {
      this.notifier.next(this.currentStep - 1);
    }
  }

  public pause() {
    this.currentlyPlaying = false;
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
    return this.algorithm.algorithmNameGetter;
  }

  async play() {
    this.currentlyPlaying = true;
    while (this.currentStep != this.amountOfSteps && this.currentlyPlaying) {
      this.moveToNextStep();
      await this.sleep(this.speed);
    }
    this.currentlyPlaying = false;
  }

  async sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  changeSpeedOfPlayback(speed : number) {
    this.speed = speed;
  }

  set currentStepSetter(step : number) {
    this.notifier.next(step);
  }

  public getAdditionalVariables() {
    return this.algorithm.stepsGetter[this.currentStep].additional;
  }
}
