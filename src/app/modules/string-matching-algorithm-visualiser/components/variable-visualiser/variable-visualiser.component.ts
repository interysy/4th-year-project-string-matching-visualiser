import { Component } from '@angular/core';
import { PlaybackServiceService } from '../../services/playback-service.service';
import { BruteForceAdditionalVariables } from '../../models/brute-force-additional-variables.model';

@Component({
  selector: 'app-variable-visualiser',
  templateUrl: './variable-visualiser.component.html',
  styleUrls: ['./variable-visualiser.component.css']
})
export class VariableVisualiserComponent {

  textLength : number;
  patternLength : number;
  startingPoint : number;
  textIndex : number;
  patternIndex : number;

  constructor(private playbackService : PlaybackServiceService) {
    this.textLength = this.playbackService.textLength;
    this.patternLength = this.playbackService.patternLength;
    this.startingPoint = 0;

    this.playbackService.notifier.subscribe((_) => {

      this.startingPoint = (this.playbackService.additionalVariables as BruteForceAdditionalVariables).startingPoint;
      this.textIndex = this.playbackService.textIndex;
      this.patternIndex = this.playbackService.patternIndex;
    });

  }
}
