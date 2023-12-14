import { Component, OnInit } from '@angular/core';
import { Modal, initTE } from 'tw-elements';
import { OptionService } from '../../services/option.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {

  protected text : string;
  protected pattern : string;
  protected preProcessingSteps : boolean;
  protected smoothAnimations : boolean ;

  constructor(private readonly optionService : OptionService) {
    this.text = this.optionService.textGetter;
    this.pattern = this.optionService.patternGetter;
    this.smoothAnimations = this.optionService.smoothAnimationsGetter;
    this.preProcessingSteps = this.optionService.preProcessingStepsGetter;
  }

  ngOnInit() {
    initTE({ Modal });
  }

  protected sendTextToService() {
    this.optionService.textSetter = this.text;
    this.optionService.textChangedSubscriberGetter.next(this.text)
  }

  protected sendPatternToService() {
    this.optionService.patternSetter = this.pattern;
    this.optionService.patternChangedSubscriberGetter.next(this.pattern)
  }

  protected setPreprocessingSteps() {
    this.optionService.preProcessingStepsSetter = this.preProcessingSteps;
  }

  protected setSmoothAnimations() {
    this.optionService.smoothAnimationsSetter = this.smoothAnimations;
  }

}