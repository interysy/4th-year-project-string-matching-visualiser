import { Component } from '@angular/core';
import { AlgorithmProgressService } from '../../services/algorithm-progress.service';

@Component({
  selector: 'app-variable-visualiser',
  templateUrl: './variable-visualiser.component.html',
  styleUrls: ['./variable-visualiser.component.css']
})
export class VariableVisualiserComponent {

  textLength : number;
  patternLength : number;
  textIndex : number;
  patternIndex : number;
  additionalVariables : { [variableName: string]: number | string; }[] = [];
  doNotDisplay = [
    "textLength",
    "patternLength",
    "textIndex",
    "patternIndex",
    "lastOccuranceTable"
  ]

  constructor(private algorithmProgressService : AlgorithmProgressService) {

    this.textLength = this.algorithmProgressService.textLength;
    this.patternLength = this.algorithmProgressService.patternLength;

    this.algorithmProgressService.notifierGetter.subscribe((_) => {
      const additional = algorithmProgressService.additionalVariablesGetter;
      console.log(additional);

      if (additional["textLength"] != undefined) this.textLength = additional["textLength"];
      if (additional["patternLength"] != undefined) this.patternLength = additional["patternLength"];
      this.textIndex = this.algorithmProgressService.textIndex;
      this.patternIndex = this.algorithmProgressService.patternIndex;


      for (const additionalVariableName of Object.keys(additional)) {
        if (this.additionalVariables.find(existingAdditionalVariable => existingAdditionalVariable["variableName"] == additionalVariableName) == undefined && !this.doNotDisplay.includes(additionalVariableName) ) {
          this.additionalVariables.push({variableName : additionalVariableName, value : additional[additionalVariableName]});
        } else {
          this.additionalVariables.map(existingAdditionalVariable => {
            if (existingAdditionalVariable["variableName"] == additionalVariableName) {
              existingAdditionalVariable["value"] = additional[additionalVariableName];
            }});
        }
      }
    });

  }
}
