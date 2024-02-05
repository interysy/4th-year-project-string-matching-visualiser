import { Component, ElementRef, ViewChild } from '@angular/core';
import { OptionService } from '../../services/option.service';
import { ThemeSelectorService } from 'src/app/modules/string-matching-algorithm-visualiser/services/theme-selector.service';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { environment } from 'src/environments/environment.dev';

/**
 * @description This component is responsible for displaying the modal, which contains settings for the application.
 * All options have their own attribute which can be changed by the HTML.
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {

  protected readonly SelectorBorderColour = "red";
  /**
   * @description Text to search in.
   */
  protected text : string;

  /**
   * @description Pattern to search for.
   */
  protected pattern : string;


  /**
   * @description Whether to filter out preprocessing steps or not.
   */
  protected preProcessingSteps : boolean;

  /**
   * @description Whether to use smooth animations or not.
   */
  protected smoothAnimations : boolean ;

  /**
   * @description Whether to show the legend or not.
   */
  protected showLegend : boolean;


  /**
   * @description Reference to the modal element, which contains all the options. Needed to open and close the modal.
   * @see openModal()
   * @see closeModal()
   */
  @ViewChild('modal', {static: true})
  modalElement: ElementRef<HTMLDivElement>;


  themes = Object.entries(environment.themes).map(([name, theme]) => ({ name : name, ...theme }));

  /**
   * @description Currently selected theme.
   * @see environment.themes
   * @see ThemeSelectorService
   */
  protected selectedTheme : string;

  /**
   * @description Create instance of ModalComponent, injects relevant services and sets default values for options.
   */
  constructor(private readonly algorithmProgressService : AlgorithmProgressService , private readonly optionService : OptionService , private themingService : ThemeSelectorService ) {
    this.selectedTheme = this.themingService.currentThemeGetter;
    this.text = this.optionService.textGetter();
    this.pattern = this.optionService.patternGetter();
    this.smoothAnimations = this.optionService.smoothAnimationsGetter();
    this.preProcessingSteps = this.optionService.preProcessingStepsGetter();
    this.selectedTheme = this.themingService.currentThemeGetter;
    this.showLegend = this.optionService.showLegendGetter();
  }


  /**
   * @description Update text for the app.
   */
  protected sendTextToService() : void {
    this.optionService.textSetter(this.text);
    this.optionService.textChangedSubscriberGetter().next(this.text)
  }

  /**
   * @description Update pattern for the app.
   */
  protected sendPatternToService(value : string) : void {
    this.pattern = value;
    this.optionService.patternSetter(this.pattern);
    this.optionService.patternChangedSubscriberGetter().next(this.pattern)
  }

  /**
   * @description Update preprocessing steps option for the app.
   */
  protected setPreprocessingSteps() : void {
    this.optionService.preProcessingStepsSetter(this.preProcessingSteps);
  }

  /**
   * @description Update smooth animations option for the app.
   */
  protected setSmoothAnimations() : void {
    this.optionService.smoothAnimationsSetter(this.smoothAnimations);
  }

  /**
   * @description Update theme option appwide.
   * @param {string} theme Theme to set.
   */
  protected selectTheme(theme : string) : void {
    this.selectedTheme = theme;
    this.themingService.themeSetter = theme;
  }

  /**
   * @description Update legend option appwide.
   */
  protected setShowLegend() {
    this.optionService.showLegendSetter(this.showLegend);
  }

  protected openModal() {
    this.modalElement.nativeElement.classList.remove("hidden");
  }

  protected closeModal() {
    this.modalElement.nativeElement.classList.add("hidden");
  }

  /**
   * @description Sets centrlise scroll option appwide. This is temporatary and turned off by P5jsDrawClass.
   * @see P5jsDrawClass
   */
  protected centraliseScroll() {
    this.optionService.centraliseScrollSetter(true);
  }

  /**
   * @description Whether the algorithm data can be centralised or not. It applies to algorithms using the extra canvas.
   * @returns {boolean} Whether the algorithm data can be centralised or not. If yes, then the animation gets put into appropriate place.
   */
  protected canAlgorithmDataBeCentralised() : boolean {
    if (environment.centraliseScroll.findIndex((value: string) => value === this.algorithmProgressService.algorithmNameGetter()) !== -1) {
      return true;
    }
    return false;
  }

  get patternGetter() {
    return this.pattern;
  }
}