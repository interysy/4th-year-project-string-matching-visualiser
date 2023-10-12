import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { BruteForceAdditionalVariables } from '../../models/brute-force-additional-variables.model';

@Component({
  selector: 'app-variable-visualiser',
  templateUrl: './variable-visualiser.component.html',
  styleUrls: ['./variable-visualiser.component.css']
})
export class VariableVisualiserComponent {

  textLength = 0 ;
  patternLength = 0
  startingPoint = -1;
  textIndex : number;
  patternIndex : number;

  constructor(private algorithmProgressService : AlgorithmProgressService) {

    this.algorithmProgressService.notifier.subscribe((_) => {
      if (this.textLength == 0) this.textLength = this.algorithmProgressService.textLength;
      if (this.patternLength == 0) this.patternLength = this.algorithmProgressService.patternLength;
      this.startingPoint = (this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).startingPoint ? (this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).startingPoint : this.startingPoint;
      this.textIndex = this.algorithmProgressService.textIndex;
      this.patternIndex = this.algorithmProgressService.patternIndex;
    });

  }
}
