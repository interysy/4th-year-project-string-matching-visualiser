import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @description Service for managing options related to string matching algorithm visualizer.
 * Includes text and pattern aswell as QOL options.
 */
@Injectable({
  providedIn: "root"
})
export class OptionService {

  /**
   * @description The default text used for string matching.
   */
  public readonly DefaultText = "bacbababaacaabaaca";

  /**
   * @description The default pattern used for string matching.
   */
  public readonly DefaultPattern = "ababaca";


  /**
   * @description The subjects for subscribing to option changes
   */
  private _textChanged$ : Subject<string> = new Subject<string>();
  private _patternChanged$ : Subject<string> = new Subject<string>();
  private _smoothAnimationsChanged$ : Subject<boolean> = new Subject<boolean>();
  private _preProcessingStepsChanged$ : Subject<boolean> = new Subject<boolean>();
  private _showLegendChanged$ : Subject<boolean> = new Subject<boolean>();

  /**
   * @description The option values
   */
  private _text : string;
  private _pattern : string;
  private _smoothAnimations = false;
  private _preProcessingSteps = true;
  private _showLegend = false;
  private _centraliseScroll = false;

  /**
   * @description Set default options.
   */
  constructor() {
    this._text = this.DefaultText;
    this._pattern = this.DefaultPattern;
  }

  /**
   * Returns the subject for subscribing to text changes.
   */
  get textChangedSubscriberGetter() : Subject<string> {
    return this._textChanged$;
  }

  /**
   * Returns the subject for subscribing to pattern changes.
   */
  get patternChangedSubscriberGetter() : Subject<string> {
    return this._patternChanged$;
  }

  /**
   * Returns the subject for subscribing to smooth animations changes.
   */
  get smoothAnimationsChangedSubscriberGetter() : Subject<boolean> {
    return this._smoothAnimationsChanged$;
  }

  /**
   * Returns the subject for subscribing to pre-processing steps changes.
   */
  get preProcessingStepsChangedSubscriberGetter() : Subject<boolean> {
    return this._preProcessingStepsChanged$;
  }

  /**
   * Returns the subject for subscribing to show legend changes.
   */
  get showLegendChangedSubscriberGetter() : Subject<boolean> {
    return this._showLegendChanged$;
  }


  /**
   * Sets the text value and emits the text changed event.
   * @param text The new text value.
   */
  set textSetter(text : string) {
    this._text = text;
    this._textChanged$.next(this._text);
  }

  /**
   * Sets the pattern value and emits the pattern changed event.
   * @param pattern The new pattern value.
   */
  set patternSetter(pattern : string) {
    this._pattern = pattern;
    this._patternChanged$.next(this._pattern);
  }

  /**
   * Sets the smooth animations value and emits the smooth animations changed event.
   * @param smoothAnimations The new smooth animations value.
   */
  set smoothAnimationsSetter(smoothAnimations : boolean) {
    this._smoothAnimations = smoothAnimations;
    this._smoothAnimationsChanged$.next(this._smoothAnimations);
  }

  /**
   * Sets the pre-processing steps value and emits the pre-processing steps changed event.
   * @param preProcessingSteps The new pre-processing steps value.
   */
  set preProcessingStepsSetter(preProcessingSteps : boolean) {
    this._preProcessingSteps = preProcessingSteps;
    this._preProcessingStepsChanged$.next(this._preProcessingSteps);
  }

  /**
   * Sets the show legend value and emits the show legend changed event.
   * @param showLegend The new show legend value.
   */
  set showLegendSetter(showLegend : boolean) {
    this._showLegend = showLegend;
    this._showLegendChanged$.next(this._showLegend);
  }

  set centraliseScrollSetter(centraliseScroll : boolean) {
    this._centraliseScroll = centraliseScroll;
  }

  /**
   * Returns the current text value.
   */
  get textGetter() : string {
    return this._text;
  }

  /**
   * Returns the current pattern value.
   */
  get patternGetter() : string {
    return this._pattern;
  }

  /**
   * Returns the current smooth animations value.
   */
  get smoothAnimationsGetter() : boolean {
    return this._smoothAnimations;
  }

  /**
   * Returns the current pre-processing steps value.
   */
  get preProcessingStepsGetter() : boolean {
    return this._preProcessingSteps;
  }

  /**
   * Returns the current show legend value.
   */
  get showLegendGetter() : boolean {
    return this._showLegend;
  }

  get centraliseScrollGetter() : boolean {
    return this._centraliseScroll;
  }

}
