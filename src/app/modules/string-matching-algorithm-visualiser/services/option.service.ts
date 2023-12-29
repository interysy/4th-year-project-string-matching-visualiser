import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class OptionService {

  public readonly DefaultText = "The fox jumped over the lazy dog";
  public readonly DefaultPattern = "lazy";

  private _textChanged$ : Subject<string> = new Subject<string>();
  private _patternChanged$ : Subject<string> = new Subject<string>();
  private _smoothAnimationsChanged$ : Subject<boolean> = new Subject<boolean>();
  private _preProcessingStepsChanged$ : Subject<boolean> = new Subject<boolean>();
  private _showLegendChanged$ : Subject<boolean> = new Subject<boolean>();

  private _text : string;
  private _pattern : string;
  private _smoothAnimations = false;
  private _preProcessingSteps = true;
  private _showLegend = false;

  constructor() {
    this._text = this.DefaultText;
    this._pattern = this.DefaultPattern;
  }

  get textChangedSubscriberGetter() : Subject<string> {
    return this._textChanged$;
  }

  get patternChangedSubscriberGetter() : Subject<string> {
    return this._patternChanged$;
  }

  get smoothAnimationsChangedSubscriberGetter() : Subject<boolean> {
    return this._smoothAnimationsChanged$;
  }

  get preProcessingStepsChangedSubscriberGetter() : Subject<boolean> {
    return this._preProcessingStepsChanged$;
  }

  get showLegendChangedSubscriberGetter() : Subject<boolean> {
    return this._showLegendChanged$;
  }

  set textSetter(text : string) {
    this._text = text;
    this._textChanged$.next(this._text);
  }

  set patternSetter(pattern : string) {
    this._pattern = pattern;
    this._patternChanged$.next(this._pattern);
  }

  set smoothAnimationsSetter(smoothAnimations : boolean) {
    this._smoothAnimations = smoothAnimations;
    this.smoothAnimationsChangedSubscriberGetter.next(this._smoothAnimations);
  }

  set preProcessingStepsSetter(preProcessingSteps : boolean) {
    this._preProcessingSteps = preProcessingSteps;
    this._preProcessingStepsChanged$.next(this._preProcessingSteps);
  }

  set showLegendSetter(showLegend : boolean) {
    this._showLegend = showLegend;
    this._showLegendChanged$.next(this._showLegend);
  }

  get textGetter() : string {
    return this._text;
  }

  get patternGetter() : string {
    return this._pattern;
  }

  get smoothAnimationsGetter() : boolean {
    return this._smoothAnimations;
  }

  get preProcessingStepsGetter() : boolean {
    return this._preProcessingSteps;
  }

  get showLegendGetter() : boolean {
    return this._showLegend;
  }

}
