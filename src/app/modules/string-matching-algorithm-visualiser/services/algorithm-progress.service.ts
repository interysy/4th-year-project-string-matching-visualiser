import { Injectable } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { StringMatchingAlgorithm } from '../algorithms/algorithm.model';
import { DrawStepDecorator } from '../models/drawer-step.decorator';
import { StringMatchingAlgorithmToDraw } from '../drawers/algorithm-draw.model';
import { AlgorithmStep } from '../models/algorithm-step.model';
import { OptionService } from './option.service';
import { AdditionalVariables } from '../models/additional-variables.model';

/**
 * @description The AlgorithmProgressService class provides methods for managing the progress and execution of string matching algorithms.
 */
@Injectable({
  providedIn: "root"
})
export class AlgorithmProgressService {

  /**
   * @description The default speed of the animation.
   */
  public readonly DefaultSpeed = 1000;

  /**
   * @description The minimum speed of the animation.
   */
  public readonly MinimumSpeed = 100;


  /**
   * @description The maximum speed of the animation.
   */
  public readonly MaximumSpeed = 2050;

  /**
   * @description The time to wait before changing animation when something changes. Typically text or pattern.
   * @see OptionService
   *
   */
  public readonly Debounce = 1000;

  /**
   * @description The notifier is used to notify the components that the algorithm's progress has changed.
   * It allows the implementation of the observer pattern, where each component receives a notification upon change.
   */
  private _stepChanged$ : Subject<number> = new Subject<number>();


  /**
   * @description The notifier is used to notify the components that the playback speed has changed.
   * Required as speed is dictated by the animation.
   */
  private _speedChanged$ : Subject<number> = new Subject<number>();


  /**
   * @description The variable is used to denote whether the animation is playing.
   */
  private _currentlyPlaying = false;

  /**
   * @description The variable is used to store the current step of the algorithm.
   */
  private _currentStep : number;

  /**
   * @description The injected algorithm to run.
   */
  private _algorithm : StringMatchingAlgorithm;

  /**
   * @description Variable used to set speed of playback.
   */
  private _speed = this.DefaultSpeed;

  /**
   * @description The variable is used to store all subscriptions to things that can change.
   */
  subscriptions : Subscription[] = [];


  /**
   * @description The decorated algorithm is used to decorate the algorithm with decorators that allow the algorithm to be visualised with
   * extra information when required.
   */
  private _decoratedAlgorithm : DrawStepDecorator;


  /**
   * @description The variable is used to store the steps of the algorithm for a specific text and pattern.
   */
  private _steps: AlgorithmStep[];

  /**
   * @description Stores the number of the previous step that has been shown
   */
  private _previousStep : number;


  /**
   * @description Constructor initiates all required subscribers
   * @param optionService Using option service to get option changes
   */
  constructor(private readonly optionService : OptionService) {

    const subscribersForReset = [this.optionService.textChangedSubscriberGetter() , this.optionService.patternChangedSubscriberGetter()];

    subscribersForReset.forEach((subscriber) => {
      this.subscriptions.push(subscriber.pipe(debounceTime(this.Debounce)).subscribe((_) => {
        this.resetService();
        this.executeAlgorithm();
      }));
    });

    this.subscriptions.push(this.optionService.preProcessingStepsChangedSubscriberGetter().subscribe((preProcessingSteps : boolean) => {
      this.filterPreProcessingSteps(preProcessingSteps);
    }));
  }


  /**
   * @description The function is used to remove steps used for preprocessing.
   * @param preProcessingSteps Whether to remove preprocessing steps or not
   */
  private filterPreProcessingSteps(preProcessingSteps : boolean) : void {
    const filteredSteps = this._algorithm.stepsGetter.filter((step) => step.extra == false);
    this._steps  = preProcessingSteps ?  this._algorithm.stepsGetter : filteredSteps;
    this.resetProgress();


  }


  /**
   * @description The function injects the algorithm into the service. It also resets the progress of the algorithm to allow new algorithm to run.
   * @param algorithmToInject New algorithm to run
   * @param algorithmName The algorithm name
   * @param decorators The visual aspects to be drawn as an array of decorators
   */
  public injectAlgorithm(algorithmToInject : { new (): StringMatchingAlgorithm } , decorators : { new (decoratorName : StringMatchingAlgorithmToDraw): DrawStepDecorator }[], prePreprocessingCanvas : boolean , preProcessingFunction : string | null) : void {

    this.resetService();

    this._algorithm = new algorithmToInject();
    if (decorators.length !== 0) {
      let oldDecorator = this._algorithm as StringMatchingAlgorithmToDraw;
      decorators.forEach((decorator) => {
        this._decoratedAlgorithm = new decorator(oldDecorator);
        oldDecorator = this._decoratedAlgorithm;
      });
    }

    if (prePreprocessingCanvas && preProcessingFunction != null) {
      this._algorithm.preProcessingCanvasSetter = true;
      this._algorithm.preProcessingFunctionSetter = preProcessingFunction;
    }

    this.executeAlgorithm();
  }

  /**
   * @description The function executes the algorithm and works out the steps.
   */
  private executeAlgorithm() : void {
    this._algorithm.workOutSteps(this.optionService.textGetter(), this.optionService.patternGetter());
    this.filterPreProcessingSteps(this.optionService.preProcessingStepsGetter());
    this._currentStep = 0;
    this._previousStep = 0;
    this._stepChanged$.next(0);
  }

  /**
   * @description The function resets the algorithm's progress.
   */
  public resetProgress() : void {
    this._currentlyPlaying = false;
    this._currentStep = 0;
    this._previousStep = 0;
    this._stepChanged$.next(0);
  }

  /**
   * @description The function resets the algorithm's progress and any data related to it, so another algorithm can be executed.
   * @see resetProgress() This avoids changing algorithm, so steps remain the same.
   */
  private resetService() : void {
    this.resetProgress();
    this._steps = [];
    if (this._algorithm) this._algorithm.resetSteps();
  }

  /**
   * @description The function moves the algorithm to the next step.
   * Available only when not playing.
   * @see play()
   */
  public moveToNextStep() : void {
    if (this._currentStep != this._steps.length - 1) {
      this._previousStep = this._currentStep;
      this._currentStep += 1;
      this._stepChanged$.next(this._currentStep);
    } else {
      this._currentlyPlaying = false;
    }
  }

  /**
   * @description The function moves the algorithm to the previous step.
   * Available when not playing only.
   * @see play()
   */
  public moveToPreviousStep() : void {
    if (this._currentStep > 0) {
      this._previousStep = this._currentStep;
      this._currentStep -= 1;
      this._stepChanged$.next(this._currentStep);
    }
  }

  /**
   * @description The function pauses the algorithm.
   * Available when playing only.
   * @see play()
   * @returns Promise<void>
   */
  public async pause() : Promise<void> {
    this._currentlyPlaying = false;
  }

  /**
   * @description The function plays the algorithm.
   * Available when not playing only.
   * @see pause()
   * @returns Promise<void>
   */
  public async play() : Promise<void> {
    this._currentlyPlaying = true;
  }


  /**
   * @description The function changes the speed of playback.
   * @param speed The new speed of playback
   */
  public changeSpeedOfPlayback(speed : number) : void {
    this._speed = speed;
    this._speedChanged$.next(this._speed);
  }

  /**
   * @description Get current step number
   */
  public currentStepNumberGetter() : number {
    return this._currentStep;
  }

  /**
   * @description Gets the previous step number
   */
  public previousStepNumberGetter() : number {
    return this._previousStep;
  }

  /**
   * @description Return the previously shown step
   */
  public previousStepGetter() : AlgorithmStep {
    return this._steps[this._previousStep];
  }

  /**
   * @description Get amount of steps the algorithm has generated
   */
  public amountOfStepsGetter() : number {
    return this._steps.length;
  }

  /**
   * @description Get the current step object
   */
  public stepGetter() : AlgorithmStep {
    return this._steps[this._currentStep];
  }

  /**
   * @description Get the current pseudocode line number.
   */
  public pseudocodeLine() : number {
    return this._steps[this._currentStep].pseudocodeLine;
  }

  /**
   * @description Get the current pattern index.
   */
  public patternIndex() : number {
    return this._steps[this._currentStep].patternIndex;
  }

  /**
   * @description Get the current text index.
   */
  public textIndex() : number {
    return this._steps[this._currentStep].textIndex;
  }

  /**
   * @description Get the current message regarding what algorithm is doing.
   */
  public command() : string {
    return this._steps[this._currentStep].command;
  }

  /**
   * @description Get the current text length.
   */
  public textLength() : number {
    return this._steps[this._currentStep].additional.textLength;
  }

  /**
   * @description Get the current pattern length.
   */
  public patternLength() : number {
    return this._steps[this._currentStep].additional.patternLength;
  }

  /**
   * @description Get additional variables for an algorithm.
   * @example KMP algorithm has a table that needs to be displayed.
   */
  public additionalVariablesGetter() : AdditionalVariables {
    return this._steps[this._currentStep].additional;
  }

  /**
   * @description Get the name of the currently injected algorithm.
   */
  public algorithmNameGetter() : string {
    return this._algorithm.algorithmNameGetter;
  }

  /**
   * @description Get algorithm decorated with functions that draw on top of animation.
   */
  public decoratedAlgorithmGetter() : DrawStepDecorator {
    return this._decoratedAlgorithm;
  }

  /**
   * @description Find out whether animation is currently playing.
   */
  public currentlyPlayingGetter() : boolean {
    return this._currentlyPlaying;
  }

  /**
   * @description Get the current speed of playback.
   */
  public speedGetter() : number {
    return this._speed;
  }

  /**
   * @description Find out whether algorithm requires an extra canvas for drawing.
   */
  public extraCanvasGetter() : string | null {
    return this._algorithm.extraCanvasGetter;
  }

  /**
   * @description Get the subscription for changing steps. This is used by components to get notifications on step changes.
   */
  public stepChangedSubscriberGetter() : Subject<number> {
    return this._stepChanged$;
  }

  /**
   * @description Get the subscription for changing speed. This is used by components to get notifications on speed changes.
   */
  public speedChangedSubscriberGetter() : Subject<number> {
    return this._speedChanged$;
  }

  /**
   * @description Get the pseudocode filename for the current algorithm - may not be a string matching algorithm, but perhaps a helper.
   * @example KMP has a border table creation algorithm
   */
  public pseudocodeFilenameGetter() : string {
    return this._steps[this._currentStep].pseudocodeFilename;
  }

  /**
   * @description Update step number
   */
  public currentStepNumberSetter(step : number) : void {
    if (step < 0 || step > this._steps.length - 1) return;
    this._previousStep = this._currentStep;
    this._currentStep = step;
    this._stepChanged$.next(step);
  }

}
