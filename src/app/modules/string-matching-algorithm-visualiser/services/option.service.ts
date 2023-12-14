import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionService {


  private $textChanged: Subject<string> = new Subject<string>();
  private $patternChanged : Subject<string> = new Subject<string>();
  private $smoothAnimationsChanged : Subject<boolean> = new Subject<boolean>();
  private $preProcessingStepsChanged : Subject<boolean> = new Subject<boolean>();

  private text = "The fox jumped over the lazy dog";
  private pattern = "lazy";
  private smoothAnimations = false;
  private preProcessingSteps = true;

  get textChangedSubscriberGetter() : Subject<string> {
    return this.$textChanged;
  }

  get patternChangedSubscriberGetter() : Subject<string> {
    return this.$patternChanged;
  }

  get smoothAnimationsChangedSubscriberGetter() : Subject<boolean> {
    return this.$smoothAnimationsChanged;
  }

  get preProcessingStepsChangedSubscriberGetter() : Subject<boolean> {
    return this.$preProcessingStepsChanged;
  }

  set textSetter(text : string) {
    this.text = text;
    this.$textChanged.next(this.text);
  }

  set patternSetter(pattern : string) {
    this.pattern = pattern;
    this.$patternChanged.next(this.pattern);
  }

  set smoothAnimationsSetter(smoothAnimations : boolean) {
    this.smoothAnimations = smoothAnimations;
    this.smoothAnimationsChangedSubscriberGetter.next(this.smoothAnimations);
  }

  set preProcessingStepsSetter(preProcessingSteps : boolean) {
    this.preProcessingSteps = preProcessingSteps;
    this.$preProcessingStepsChanged.next(this.preProcessingSteps);
  }

  get textGetter() : string {
    return this.text;
  }

  get patternGetter() : string {
    return this.pattern;
  }

  get smoothAnimationsGetter() : boolean {
    return this.smoothAnimations;
  }

  get preProcessingStepsGetter() : boolean {
    return this.preProcessingSteps;
  }

}
