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

  constructor(private algorithmProgressService : AlgorithmProgressService) {
    this.changeIconSize();
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

  changeIconSize() {
   this.iconSize = window.innerHeight > 1400 ? "xl" : "lg";

  }
}
