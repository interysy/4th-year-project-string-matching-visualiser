import { Component } from '@angular/core';
import { PlaybackServiceService } from '../../services/playback-service.service';

@Component({
  selector: 'app-variable-visualiser',
  templateUrl: './variable-visualiser.component.html',
  styleUrls: ['./variable-visualiser.component.css']
})
export class VariableVisualiserComponent {

  textLength : number;
  patternLength : number;
  //startingPoint : number;
  textIndex : number;
  patternIndex : number;

  constructor(private playbackService : PlaybackServiceService) {
    this.textLength = this.playbackService.textLength;
    this.patternLength = this.playbackService.patternLength;
    this.playbackService.currentStepObservator.subscribe((_) => {
      //this.startingPoint = this.playbackService.startingPoint;
      this.textIndex = this.playbackService.textIndex;
      this.patternIndex = this.playbackService.patternIndex;
  });
  }

}
