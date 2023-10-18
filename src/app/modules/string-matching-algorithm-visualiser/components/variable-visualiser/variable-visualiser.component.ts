import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';
import { BruteForceAdditionalVariables } from '../../models/brute-force-additional-variables.model';

@Component({
  selector: 'app-variable-visualiser',
  templateUrl: './variable-visualiser.component.html',
  styleUrls: ['./variable-visualiser.component.css']
})
export class VariableVisualiserComponent {

  textLength = -1 ;
  patternLength = -1;
  startingPoint = -1;
  textIndex : number;
  patternIndex : number;

  constructor(private algorithmProgressService : AlgorithmProgressService) {

    this.algorithmProgressService.notifier.subscribe((_) => {

      this.startingPoint = ((this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).startingPoint !=  undefined) ? (this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).startingPoint : this.startingPoint;
      this.textLength = (this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).textLength ? (this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).textLength : this.textLength;
      this.patternLength = (this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).patternLength ? (this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).patternLength : this.patternLength;
      this.textIndex = this.algorithmProgressService.textIndex;
      this.patternIndex = this.algorithmProgressService.patternIndex;
    });

  }
}
