import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';

@Component({
  selector: 'app-playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.css']
})
export class PlaybackControlsComponent {

  paused = true;

  constructor(private algorithmProgressService : AlgorithmProgressService) {}

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
}
