import { Component } from '@angular/core';
import { BruteForceAdditionalVariables } from '../../models/brute-force-additional-variables.model';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';

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

  constructor(private algorithmProgressService : AlgorithmProgressService) {
    this.textLength = this.algorithmProgressService.textLength;
    this.patternLength = this.algorithmProgressService.patternLength;
    this.startingPoint = 0;

    this.algorithmProgressService.notifier.subscribe((_) => {

      this.startingPoint = (this.algorithmProgressService.additionalVariables as BruteForceAdditionalVariables).startingPoint;
      this.textIndex = this.algorithmProgressService.textIndex;
      this.patternIndex = this.algorithmProgressService.patternIndex;
    });

  }
}
