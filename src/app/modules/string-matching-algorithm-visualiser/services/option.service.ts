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


  private _isSlider : boolean;

  /**
   * @description Set default options.
   */
  constructor() {
    this._text = this.DefaultText;
    this._pattern = this.DefaultPattern;
    const randomNumber = Math.random();
    console.log(randomNumber)
    this._isSlider = randomNumber > 0;
    console.log(this._isSlider);
  }

  /**
   * Returns the subject for subscribing to text changes.
   */
  public textChangedSubscriberGetter() : Subject<string> {
    return this._textChanged$;
  }

  /**
   * Returns the subject for subscribing to pattern changes.
   */
  public patternChangedSubscriberGetter() : Subject<string> {
    return this._patternChanged$;
  }

  /**
   * Returns the subject for subscribing to smooth animations changes.
   */
  public smoothAnimationsChangedSubscriberGetter() : Subject<boolean> {
    return this._smoothAnimationsChanged$;
  }

  /**
   * Returns the subject for subscribing to pre-processing steps changes.
   */
  public preProcessingStepsChangedSubscriberGetter() : Subject<boolean> {
    return this._preProcessingStepsChanged$;
  }

  /**
   * Returns the subject for subscribing to show legend changes.
   */
  public showLegendChangedSubscriberGetter() : Subject<boolean> {
    return this._showLegendChanged$;
  }


  /**
   * Sets the text value and emits the text changed event.
   * @param text The new text value.
   */
  public textSetter(text : string) {
    this._text = text;
    this._textChanged$.next(this._text);
  }

  /**
   * Sets the pattern value and emits the pattern changed event.
   * @param pattern The new pattern value.
   */
  public patternSetter(pattern : string) {
    this._pattern = pattern;
    this._patternChanged$.next(this._pattern);
  }

  /**
   * Sets the smooth animations value and emits the smooth animations changed event.
   * @param smoothAnimations The new smooth animations value.
   */
  public smoothAnimationsSetter(smoothAnimations : boolean) {
    this._smoothAnimations = smoothAnimations;
    this._smoothAnimationsChanged$.next(this._smoothAnimations);
  }

  /**
   * Sets the pre-processing steps value and emits the pre-processing steps changed event.
   * @param preProcessingSteps The new pre-processing steps value.
   */
  public preProcessingStepsSetter(preProcessingSteps : boolean) {
    this._preProcessingSteps = preProcessingSteps;
    this._preProcessingStepsChanged$.next(this._preProcessingSteps);
  }

  /**
   * Sets the show legend value and emits the show legend changed event.
   * @param showLegend The new show legend value.
   */
  public showLegendSetter(showLegend : boolean) {
    this._showLegend = showLegend;
    this._showLegendChanged$.next(this._showLegend);
  }

  public centraliseScrollSetter(centraliseScroll : boolean) {
    this._centraliseScroll = centraliseScroll;
  }

  /**
   * @description Returns the current text value.
   */
  public textGetter() : string {
    return this._text;
  }

  /**
   * @description Returns the current pattern value.
   */
  public patternGetter() : string {
    return this._pattern;
  }

  /**
   * @description Returns the current smooth animations value.
   */
  public smoothAnimationsGetter() : boolean {
    return this._smoothAnimations;
  }

  /**
   * @description Returns the current pre-processing steps value.
   */
  public preProcessingStepsGetter() : boolean {
    return this._preProcessingSteps;
  }

  /**
   * @description Returns the current show legend value.
   */
  public showLegendGetter() : boolean {
    return this._showLegend;
  }

  /**
   * A getter for the centralise scroll value
   * @returns {boolean} Whether scroll needs to be centralised
   */
  public centraliseScrollGetter() : boolean {
    return this._centraliseScroll;
  }


  public isSliderGetter() : boolean {
    return this._isSlider;
  }

}
