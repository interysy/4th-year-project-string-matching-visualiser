import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Modal, initTE } from 'tw-elements';
import { OptionService } from '../../services/option.service';
import { ThemeSelectorService } from 'src/app/modules/string-matching-algorithm-visualiser/services/theme-selector.service';

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
  protected themes = [{name : "base" , colorOne : "#FFFFFF" , colorTwo : "#E3E5EA"} , {name : "theme-dark-green" , colorOne : "#2D333B" , colorTwo : "#29FD2F"}, {name : "theme-dark-blue" , colorOne : "#2D333B" , colorTwo : "#1b7ced"}];
  protected selectedTheme = this.themes[0].name;

  @ViewChild('modal', {static: true})
  modalElement: ElementRef<HTMLDivElement>;

  constructor(private readonly optionService : OptionService , private themingService : ThemeSelectorService ) {
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
    this.themingService.themeSetter = theme;
  }

  protected openModal() {
    this.modalElement.nativeElement.classList.remove('hidden');
  }

  protected closeModal() {
    this.modalElement.nativeElement.classList.add('hidden');
  }

}