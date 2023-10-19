import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';

@Component({
  selector: 'app-playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.css']
})
export class PlaybackControlsComponent {

  constructor(private algorithmProgressService : AlgorithmProgressService) {}

  previousStep() {
    this.algorithmProgressService.goToPreviousStep();
  }

  play() {
    this.algorithmProgressService.play();
  }

  nextStep() {
    this.algorithmProgressService.moveToNextStep();
  }

  reset() {
    this.algorithmProgressService.reset();
  }
}
