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
  protected themes = [{name : "default" , colorOne : "#FFFFFF" , colorTwo : "#E3E5EA"} , {name : "light" , colorOne : "#78EA78" , colorTwo : "#25AB19"} , {name : "dark" , colorOne : "#00023E" , colorTwo : "#E3E5EA"} , {name : "alternate" , colorOne : "#000000" , colorTwo : "#FFFFFF"}];
  protected selectedTheme = this.themes[0].name;

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

  protected selectTheme(theme : string) {
    this.selectedTheme = theme;
    console.log("changing theme " + this.selectedTheme);
  }

}