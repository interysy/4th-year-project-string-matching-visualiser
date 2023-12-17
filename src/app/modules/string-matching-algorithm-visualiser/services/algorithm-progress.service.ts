import { Injectable } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { StringMatchingAlgorithm } from '../models/algorithm.model';
import { DrawStepDecorator } from '../models/drawer-step.decorator';
import { StringMatchingAlgorithmToDraw } from '../models/algorithm-draw.model';
import { AlgorithmStep } from '../models/algorithm-step.model';
import { OptionService } from './option.service';

/**
 * @description The service is responsible for keeping track of the algorithm's progress. It also has functions so
 * that components can modify the progress of the algorithm.
 */
@Injectable({
  providedIn: 'root'
})
export class AlgorithmProgressService {

  /**
   * @description The notifier is used to notify the components that the algorithm's progress has changed.
   * It allows the implementation of the observer pattern, where each component receives a notification upon change.
   */
  private stepChanged$ : Subject<number> = new Subject<number>();
  private speedChanged$ : Subject<number> = new Subject<number>();

  private readonly DefaultSpeed = 1000;

  private currentlyPlaying = false;
  private currentStep = 0;
  private amountOfSteps : number;
  private text : string;
  private pattern : string;
  private algorithm : StringMatchingAlgorithm;
  private speed = this.DefaultSpeed;


  private readonly Debounce = 1000;

  private smoothAnimations = false;

  private subscriptions : Subscription[] = [];

  /**
   * @description The decorated algorithm is used to decorate the algorithm with decorators that allow the algorithm to be visualised with
   * extra information when required.
   */
  private decoratedAlgorithm : DrawStepDecorator
  preProcessingSteps = true;
  steps: AlgorithmStep[];

  constructor(private readonly optionService : OptionService) {
    this.stepChanged$.subscribe((value : number) => {
      this.currentStep = value
    });

    this.subscriptions.push(this.optionService.textChangedSubscriberGetter.pipe(debounceTime(this.Debounce)).subscribe((text : string) => {
      this.resetProgressService();
      this.textSetter = text;
    }));

    this.subscriptions.push(this.optionService.patternChangedSubscriberGetter.pipe(debounceTime(this.Debounce)).subscribe((pattern : string) => {
      this.resetProgressService();
      this.patternSetter = pattern;
    }));

    this.subscriptions.push(this.optionService.preProcessingStepsChangedSubscriberGetter.subscribe((preProcessingSteps : boolean) => {
      this.filterPreProcessingSteps(preProcessingSteps);
    }));

    this.subscriptions.push(this.optionService.smoothAnimationsChangedSubscriberGetter.subscribe((smoothAnimations : boolean) => {
      this.smoothAnimationsSetter = smoothAnimations;
      if (this.smoothAnimations == false && this.currentlyPlaying == true) {
        this.play();
      }
    }));

    this.text = this.optionService.textGetter;
    this.pattern = this.optionService.patternGetter;

  }


  private filterPreProcessingSteps(preProcessingSteps : boolean) {
    this.steps  = preProcessingSteps ?  this.algorithm.stepsGetter : this.algorithm.stepsGetter.filter((step) => step.extra == false);
    this.currentStepNumberSetter = 0;
    this.amountOfSteps = this.steps.length;
  }


  /**
   * @description The function injects the algorithm into the service. It also resets the progress of the algorithm to allow new algorithm to run.
   * @param algorithmToInject New algorithm to run
   * @param algorithmName The algorithm name
   * @param decorators The visual aspects to be drawn as an array of decorators
   * @returns void
   */
  public injectAlgorithm(algorithmToInject : { new (algorithmName : string): StringMatchingAlgorithm } , algorithmName : string , decorators : { new (decoratorName : StringMatchingAlgorithmToDraw): DrawStepDecorator }[], prePreprocessingCanvas : boolean , preProcessingFunction : string | null) : void {

    this.resetProgressService();
    this.algorithm = new algorithmToInject(algorithmName);
    if (decorators.length !== 0) {
      let oldDecorator = this.algorithm as unknown as StringMatchingAlgorithmToDraw;
      for (const decorator of decorators) {
        this.decoratedAlgorithm = new decorator(oldDecorator);
        oldDecorator = this.decoratedAlgorithm;
      }
    }

    if (prePreprocessingCanvas && preProcessingFunction != null) {
      this.algorithm.preProcessingCanvasSetter = true;
      this.algorithm.preProcessingFunctionSetter = preProcessingFunction;
    }

    this.executeAlgorithm();

  }

  /**
   * @description The function executes the algorithm and works out the steps.
   * @returns void
   */
  public executeAlgorithm() : void {
    this.algorithm.workOutSteps(this.text, this.pattern);
    this.filterPreProcessingSteps(this.preProcessingSteps);
    this.stepChanged$.next(0);
  }

  /**
   * @description The function sets the text and pattern and resets the algorithm's progress.
   * @param text The text to be set
   * @param pattern The pattern to be set
   * @returns void
   */
  public setTextAndPattern(text : string, pattern : string) : void {
    this.text = text;
    this.pattern = pattern;
    this.algorithm.resetSteps();
    this.executeAlgorithm();
  }

  /**
   * @description The function resets the algorithm's progress.
   */
  public reset() {
    this.currentlyPlaying = false;
    this.stepChanged$.next(0);
  }

  /**
   * @description The function resets the algorithm's progress and any data related to it, so another algorithm can be executed.
   */
  public resetProgressService() {
    this.currentlyPlaying = false;
    this.currentStep = 0;
    this.speed = this.DefaultSpeed;
    this.steps = [];
    this.preProcessingSteps = this.optionService.preProcessingStepsGetter;
    this.smoothAnimations = this.optionService.smoothAnimationsGetter;
  }

  /**
   * @description The function moves the algorithm to the next step.
   * Available only when not playing.
   * @see play()
   */
  public moveToNextStep() : void {
    if (this.currentStep != this.amountOfSteps - 1) {
      this.stepChanged$.next(this.currentStep + 1);
    }
  }

  /**
   * @description The function moves the algorithm to the previous step.
   * Available when not playing only.
   * @see play()
   */
  public moveToPreviousStep() : void {
    if (this.currentStep > 0) {
      this.stepChanged$.next(this.currentStep - 1);
    }
  }

  /**
   * @description The function pauses the algorithm.
   * Available when playing only.
   * @see play()
   */
  public pause() : void {
    this.currentlyPlaying = false;
  }

  /**
   * @description The function plays the algorithm.
   * Available when not playing only.
   * @see pause()
   */
  async play() : Promise<void> {
    this.currentlyPlaying = true;
  }

  /**
   *
   * @param msec The time to sleep in milliseconds
   * @returns Promise<void>
   */
  async sleep(msec: number) : Promise<void> {
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  /**
   * @description The function changes the speed of playback.
   * @param speed The new speed of playback
   */
  changeSpeedOfPlayback(speed : number) : void {
    this.speed = speed;
    this.speedChanged$.next(speed);
  }

  get currentStepNumberGetter() {
    return this.currentStep;
  }

  get amountOfStepsGetter() {
    return this.amountOfSteps;
  }

  get stepGetter() {
    return this.steps[this.currentStep];
  }

  get pseudocodeLine() {
    return this.steps[this.currentStep].pseudocodeLine;
  }

  get patternIndex() {
    return this.steps[this.currentStep].patternIndex;
  }

  get textIndex() {
    return this.steps[this.currentStep].textIndex;
  }

  get command() {
    return this.steps[this.currentStep].command;
  }

  get textLength() {
    return this.algorithm.textLengthGetter;
  }

  get patternLength() {
    return this.algorithm.patternLengthGetter;
  }

  get additionalVariablesGetter() {
    return this.steps[this.currentStep].additional;
  }

  get algorithmNameGetter() {
    return this.algorithm.algorithmNameGetter;
  }

  get decoratedAlgorithmGetter() {
    return this.decoratedAlgorithm;
  }

  get currentlyPlayingGetter() {
    return this.currentlyPlaying;
  }

  get speedGetter() {
    return this.speed;
  }

  get extraCanvasGetter() {
    return this.algorithm.extraCanvasGetter;
  }

  get smoothAnimationsGetter() {
    return this.smoothAnimations;
  }

  get stepChangedSubscriberGetter() : Subject<number> {
    return this.stepChanged$;
  }

  get speedChangedSubscriberGetter() : Subject<number> {
    return this.speedChanged$;
  }

  get pseudocodeFilenameGetter() {
    return this.steps[this.currentStep].pseudocodeFilename;
  }

  set textSetter(text : string) {
    this.text = text;
    this.algorithm.resetSteps();
    this.executeAlgorithm();
  }

  set patternSetter(pattern : string) {
     this.pattern = pattern;
     this.algorithm.resetSteps();
     this.executeAlgorithm();
  }


  set currentStepNumberSetter(step : number) {
    this.stepChanged$.next(step);
  }

  set smoothAnimationsSetter(isAnimationSmooth : boolean) {
    this.smoothAnimations = isAnimationSmooth;
    if (this.smoothAnimations == false && this.currentlyPlaying == true) {
      this.play();
    }
  }
}
