import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
// import { MatSliderModule } from "@angular/material/slider";

@Component({
  selector: 'app-playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.css']
})
export class PlaybackControlsComponent {

  paused = true;
  speedOfPlayback = 1200;
  iconSize = "xl";
  currentStep : number;
  amountOfSteps : number;

  constructor(private algorithmProgressService : AlgorithmProgressService) {
    this.currentStep = this.algorithmProgressService.currentStepNumberGetter;
    this.amountOfSteps = this.algorithmProgressService.amountOfStepsGetter;

    this.algorithmProgressService.stepChangedSubscriberGetter.subscribe((_) => {
      this.currentStep = this.algorithmProgressService.currentStepNumberGetter;
      this.amountOfSteps = this.algorithmProgressService.amountOfStepsGetter;

      if (this.currentStep == this.amountOfSteps - 1 && !this.paused) {
        this.paused = true;
      }
    });
  }

  previousStep() {
    this.algorithmProgressService.moveToPreviousStep();
  }

  play() {
    this.paused = false;
    this.algorithmProgressService.play();
  }

  nextStep() {
    this.algorithmProgressService.moveToNextStep();
  }

  reset() {
    this.paused = true;
    this.algorithmProgressService.reset();
  }

  pause() {
    this.paused = true;
    this.algorithmProgressService.pause();
  }

  changePlaybackSpeed() {
    this.algorithmProgressService.changeSpeedOfPlayback(this.speedOfPlayback);
  }

  setStep() {
    this.algorithmProgressService.currentStepNumberSetter = this.currentStep;
  }

}
