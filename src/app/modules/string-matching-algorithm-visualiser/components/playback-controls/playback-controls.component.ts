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
  currentStep = 0;
  amountOfSteps = 0;

  constructor(private algorithmProgressService : AlgorithmProgressService) {
    this.algorithmProgressService.notifier.subscribe((_) => {
      this.currentStep = this.algorithmProgressService.currentStep;
      this.amountOfSteps = this.algorithmProgressService.amountOfSteps;
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
    this.algorithmProgressService.currentStepSetter = this.currentStep;
  }

}
